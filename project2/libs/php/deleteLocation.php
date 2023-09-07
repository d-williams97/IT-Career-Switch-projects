<?php

// example use from browser
// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

// remove next two lines for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");


$location = $_REQUEST['location'];
$ID = $_REQUEST['id'];

// error_log(print_r($ID, true));
// error_log(print_r($location, true));



$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

	$output['status']['code'] = "500";
	$output['status']['name'] = "failure";
	$output['status']['description'] = 'Internal server error: database';
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

	exit;
}


//  ------ GETTING FILTER DATA ------- //


$filterDataQuery = 'SELECT d.name as department, d.locationID
FROM department d
LEFT JOIN location l ON (l.id = d.locationID)
ORDER BY d.name, l.name';

$filterDataResult = $conn->query($filterDataQuery);

if (!$filterDataResult) {
	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";	
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output); 

	exit; 
}


$filterData = []; 

while ($row = mysqli_fetch_assoc($filterDataResult)) {
	array_push($filterData, $row);
};

// error_log(print_r($filterData, true));



$findData = array_filter($filterData, function ($val) use ($ID) {

	return findLocID($val, $ID);
});

function findLocID($val, $ID)
{
	return $val['locationID'] == $ID;
};

error_log(print_r($findData, true));



// IF ANY DEPARTMENT LOC ID'S = THE SELECTED LOC ID THEN LOCATION CANNOT BE DELETED.

if (count($findData) !== 0) {

	$output['status']['code'] = "500";
	$output['status']['name'] = "failure";
	$output['status']['description'] = "Location is associated with departments";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

	exit;
} 
// IF SELECTED LOCATION ID IS NOT PRESENT IN DEPARTMENT DATA THEN DELETE QUERY EXECUTES.
else {

	$query = $conn->prepare('DELETE FROM location WHERE id = ?');

	$query->bind_param("i", $ID);

	$query->execute();

	if ($query === false) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "failed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
	};


	// GET LOCATION DATA TO FILL TABLE

	$getLocationData = 'SELECT l.name as location, l.id as locationID
FROM location l
ORDER BY l.name';

$locationResult = $conn->query($getLocationData);

if (!$locationResult) {
	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";	
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output); 

	exit; 
}


$locationData = []; 

while ($row = mysqli_fetch_assoc($locationResult)) {
	array_push($locationData, $row);
};

$output['status']['code'] = '200';
$output['status']['name'] = 'ok';
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . ' ms';
$output['data'] = $locationData;

	mysqli_close($conn);

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);
}
