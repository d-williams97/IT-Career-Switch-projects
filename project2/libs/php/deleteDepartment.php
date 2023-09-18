<?php



ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");


$ID = $_REQUEST['id'];

// error_log(print_r($ID, true));




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

// -- DELETE DEPARTMENT QUERY -- //

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
