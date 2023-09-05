<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getPersonnelByID.php?id=<id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');


	$employeeID = $_REQUEST['employeeID'];
	$firstName = trim(ucfirst($_REQUEST['newFirstName']));
	$lastName = trim(ucfirst($_REQUEST['newLastName']));
	$department = trim(ucfirst($_REQUEST['newDepartment']));
	$departmentID = $_REQUEST['departmentID'];
	$email = trim(strtolower($_REQUEST['newEmail']));
	$job = trim(ucfirst($_REQUEST['newJobTitle']));


		error_log(print_r($departmentID, true));


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

	$query = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?');

	$query->bind_param("ssssii", $firstName, $lastName, $job, $email, $departmentID, $employeeID );

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

	$query2 = 'SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, d.id as departmentID, l.name as location 
	FROM personnel p
	 LEFT JOIN department d ON (d.id = p.departmentID)
	  LEFT JOIN location l ON (l.id = d.locationID) 
	  ORDER BY p.lastName, p.firstName, d.name, l.name';
	  
	 
	  $result = $conn->query($query2);

	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit; 

	}
   
   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) { 
		array_push($data, $row); 

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 





?>