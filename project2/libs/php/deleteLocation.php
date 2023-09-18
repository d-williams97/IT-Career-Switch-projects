<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

$ID = $_REQUEST['id'];


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


//  ------ DELETING LOCATION ------- //

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


	// -- GET LOCATION DATA TO FILL TABLE -- //

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

