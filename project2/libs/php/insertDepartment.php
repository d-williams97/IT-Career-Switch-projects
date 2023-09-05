<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=<id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$department = trim(ucfirst($_REQUEST['department']));
	$locationID = $_REQUEST['locationID'];

	
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

	$query = 'SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, d.id as departmentID, l.name as location 
	FROM personnel p
	 LEFT JOIN department d ON (d.id = p.departmentID)
	  LEFT JOIN location l ON (l.id = d.locationID) 
	  ORDER BY p.lastName, p.firstName, d.name, l.name';

	// p.lastName, p.firstName, p.jobTitle These are column names of the personnel table that you want to select and include in the result set.
	// as sets alias names for columns in the results set (d.name as department, l.name as location). 
	// p is short for personnel d is short for department etc.
	// LEFT JOIN operation that connects the personnel table (p) with the department table (d) based on the condition that the id column in the department table matches the departmentID column in the personnel table.
	// LEFT JOIN operation that connects the department table (d) with the location table (l) based on the condition that the id column in the location table matches the locationID column in the department table.
	// ORDER BY: This clause specifies the order in which the result rows will be presented.

	$result = $conn->query($query); // The query() method is used to execute a SQL query on the database. It takes a single argument, which is the SQL query string to be executed. In this case, the query string is stored in the variable $query.
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit; 

	}
   
   	$data = []; // Will be used to store the fetched data from the database.

	while ($row = mysqli_fetch_assoc($result)) { // while $row = mysqli_fetch_assoc($result) if truthy $row will will return a row from the $result as an associative array

		array_push($data, $row); // pushes associative array into the data array.

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 







	// $output['status']['code'] = "200";
	// $output['status']['name'] = "ok";
	// $output['status']['description'] = "success";
	// $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	// $output['data'] = [];
	
	// mysqli_close($conn);

	// echo json_encode($output); 

?>