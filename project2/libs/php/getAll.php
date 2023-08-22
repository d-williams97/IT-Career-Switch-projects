<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php"); // includes an external PHP file named "config.php" that contains the DB configuration settings.

	header('Content-Type: application/json; charset=UTF-8'); // Sets the HTTP response header to indicate that the response will be in JSON format with UTF-8 character encoding

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket); // Establishes a DB connection and creates a new mySQLi object 

	error_log(print_r($conn, true));

	if (mysqli_connect_errno()) { // returns the error code from the last connection error, if any.
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn); // Close a previously opened database connection

		echo json_encode($output);

		exit; //stops the execution of the script

	}	

	// SQL does not accept parameters and so is not prepared

	

	$query = 'SELECT p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location 
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

	while ($row = mysqli_fetch_assoc($result)) { // while $row = mysqli_fetch_assoc($result) is truthy $row will will return a row from the $result as an associative array

		// error log $row 
		array_push($data, $row); // pushes associative array into the data array.

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>