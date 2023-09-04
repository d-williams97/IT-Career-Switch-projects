<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include('config.php');

	header('Content-Type: application/json; charset=UTF-8');


	$location = trim(ucfirst($_REQUEST['location']));



	// error_log(print_r($location, true));



	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if(mysqli_connect_errno()) {
		$output['status']['code'] = '500';
		$output['status']['name'] = 'failure';
		$output['status']['description'] = 'Internal server error: database';
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . 'ms';
		$output['data'] = [];

		mysqli_close($conn); 

		echo json_encode($output);

		exit; 
	};

	$query = $conn->prepare('INSERT INTO location (name) VALUES(?)');

	$query->bind_param("s", $location);

	$query->execute();

	if ($query === false) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 









?>