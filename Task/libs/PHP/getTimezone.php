<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$lat = $_REQUEST['lat'];
$lng = $_REQUEST['lng'];
// error_log(print_r($lat, true));
// error_log(print_r($lng, true));

$executionStartTime = microtime(true);


$url = 'http://api.geonames.org/timezoneJSON?lat=' . $lat . '&lng=' . $lng . '&username=kwasimodo';

$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
curl_setopt($ch, CURLOPT_URL, $url);


$result = curl_exec($ch); 


curl_close($ch);


$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; 
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8'); 

echo json_encode($output); 





?>