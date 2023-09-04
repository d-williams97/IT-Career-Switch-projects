<?php

ini_set('display_errors', '1'); 
ini_set('display_startup_errors', '1');
error_reporting(E_ALL); 
	
$executionStartTime = microtime(true); 

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if(mysqli_connect_errno()) {

	$output['status']['code'] = '500';
	$output['status']['name'] = 'failure';
	$output['status']['description'] = 'Internal server error: database';
	$output['status']['returnedIn'] = (microtime(true)) - $executionStartTime / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output); 

	exit;

}

$query = 'SELECT l.name as location, l.id as locationID
FROM location l
ORDER BY l.name';

$result = $conn->query($query);

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
};

$output['status']['code'] = '200';
$output['status']['name'] = 'ok';
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . ' ms';
$output['data'] = $data;

mysqli_close($conn);
echo json_encode($output)













?>