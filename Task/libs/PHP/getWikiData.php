<?php
// Logs message to a custom log file
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);


$city = trim($_REQUEST['city']);

error_log(print_r($city, true));



$executionStartTime = microtime(true);

$url = 'http://api.geonames.org/wikipediaSearch?q=' . $city . '&maxRows=10&username=kwasimodo';



$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
curl_setopt($ch, CURLOPT_URL, $url);


$result = curl_exec($ch); 
curl_close($ch);


$decode = simplexml_load_string($result); // Takes a well-formed XML string and returns it as an object.



$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; //intval — Get the integer value of a variable
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8'); // header() is used to send a raw HTTP header which is stored in the response sent back with the data with echo below.

echo json_encode($output); 
// echo json_encode($decode); 


// error_log(print_r($decode), true);










?>