<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);


$executionStartTime = microtime(true);

$localJsonFilePath = dirname(__DIR__) . '/assets/countryBorders.geo.json';
$jsonData = file_get_contents($localJsonFilePath);

// ---------PROCESSING JSON DATA --------//

$decodedJson = json_decode($jsonData, true);


// Checking that data returned is present //

if ($decodedJson) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decodedJson;
} else {
    $output['status']['code'] = "404";
    $output['status']['description'] = "data not found";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
}




header('Content-Type: application/json; charset=UTF-8'); // header() is used to send a raw HTTP header which is stored in the response sent back with the data with echo below.

// echo json_encode($output); 
echo json_encode($output);
