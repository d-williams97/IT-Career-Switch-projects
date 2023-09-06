<?php

// example use from browser
// http://localhost/companydirectory/libs/php/getPersonnelByID.php?id=<id>

// remove next two lines for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");


$department = trim(ucfirst($_REQUEST['department']));
$departmentID = $_REQUEST['departmentID'];
$location = trim(ucfirst($_REQUEST['location']));
$locationID = $_REQUEST['locationID'];


error_log(print_r($department, true));
error_log(print_r($departmentID, true));
error_log(print_r($location, true));
error_log(print_r($locationID, true));


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

$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');

$query->bind_param("sii", $department, $locationID, $departmentID);

$query->execute();

if ($query = false) {

	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

	exit;
}


// -------- GETTING DEPARTMENT DATA ----------- //

$getDepartmentData = 'SELECT d.name as department, l.name as location, d.id as departmentID 
FROM department d
LEFT JOIN location l ON (l.id = d.locationID)
ORDER BY d.name, l.name';

$departmentResult = $conn->query($getDepartmentData);

if (!$departmentResult) {
	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";	
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output); 

	exit; 
}


$departmentData = []; 

while ($row = mysqli_fetch_assoc($departmentResult)) {
	array_push($departmentData, $row);
};


// -------- GETTING ALL DATA ----------- //

	$getAllData = 'SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, d.id as departmentID, l.name as location 
	FROM personnel p
	 LEFT JOIN department d ON (d.id = p.departmentID)
	  LEFT JOIN location l ON (l.id = d.locationID) 
	  ORDER BY p.lastName, p.firstName, d.name, l.name';
	  
	 
	  $allDataResult = $conn->query($getAllData);

	if (!$allDataResult) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit; 

	}
   
   	$allData = [];

	while ($row = mysqli_fetch_assoc($allDataResult)) { 
		array_push($allData, $row); 

	}

	$output['status']['code'] = '200';
	$output['status']['name'] = 'ok';
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . ' ms';
	$output['departmentData'] = $departmentData;
	$output['allData'] = $allData;
	
	mysqli_close($conn);

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
