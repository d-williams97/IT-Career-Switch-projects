<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=<id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$department = trim(ucfirst($_REQUEST['department']));
	$locationID = $_REQUEST['locationID'];
	error_log(print_r($locationID, true));

	
	// this includes the login details
	
	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

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

	// // SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// // $_REQUEST used for development / debugging. Remember to change to $_POST for production

	$query = $conn->prepare('INSERT INTO department (name, locationID) VALUES(?,?)'); // tableName, (tableName columns) VALUES (valuesToInsert).

	$query->bind_param("si", $department, $locationID); //state each datatype for each param the state the params themselves.

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$getDepartmentData = 'SELECT d.name as department, l.name as location, d.id as departmentID 
FROM department d
LEFT JOIN location l ON (l.id = d.locationID)
ORDER BY d.name, l.name';

$departmentDataResult = $conn->query($getDepartmentData);

// error_log(print_r($departmentDataResult, true));
// error_log(print_r('ran', true));

if (!$departmentDataResult) {
	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";	
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output); 

	exit; 
}


$departmentData = []; 

while ($row = mysqli_fetch_assoc($departmentDataResult)) {
	array_push($departmentData, $row);
};
	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $departmentData;
	
	mysqli_close($conn);

	echo json_encode($output); 




?>