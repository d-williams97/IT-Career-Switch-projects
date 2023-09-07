<?php

// example use from browser
// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

// remove next two lines for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");


$department = $_REQUEST['department'];
$ID = $_REQUEST['id'];

// error_log(print_r($ID, true));
// error_log(print_r($department, true));



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


$filterDataQuery = 'SELECT p.lastName, p.firstName, p.jobTitle, p.departmentID
	FROM personnel p
	 LEFT JOIN department d ON (d.id = p.departmentID)
	  LEFT JOIN location l ON (l.id = d.locationID) 
	  ORDER BY p.lastName, p.firstName, d.name, l.name';

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
}


$findData = array_filter($filterData, function ($val) use ($ID) {

	return findDepID($val, $ID);
});

function findDepID($val, $ID)
{
	return $val['departmentID'] == $ID;
};

// error_log(print_r($findData, true));


// IF ANY EMPLOYEE DEP ID'S = THE SELECTED DEP ID THEN DEPARTMENT CANNOT BE DELETED 

if (count($findData) !== 0) {

	$output['status']['code'] = "500";
	$output['status']['name'] = "failure";
	$output['status']['description'] = "Department is associated with employees";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

	exit;
}
// IF SELECTED DEPARTMENT ID IS NOT PRESENT IN EMPLOYEE DATA THEN DELETE QUERY EXECUTES.
else {

	$query = $conn->prepare('DELETE FROM department WHERE id = ?');

	$query->bind_param("i", $ID);

	$query->execute();

	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "failed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
	}

		// GET DEPARTMENT DATA TO FILL TABLE

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

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $departmentData;

	mysqli_close($conn);

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);
}
