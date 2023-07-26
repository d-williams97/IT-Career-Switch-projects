<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$lat = $_REQUEST['latitude'];
$lng = $_REQUEST['longitude'];
error_log(print_r($lat, true));
error_log(print_r($lng, true));

$executionStartTime = microtime(true);

$key = '9d163db26990640c87550f227cf50e89';
$url = 'https://api.openweathermap.org/data/2.5/weather?lat=' . $lat . '&lon=' . $lng . '&appid=' . $key .'&units=metric';
// $url = 'api.openweathermap.org/data/2.5/forecast?lat=' . $lat . '&lon=' . $lng . '&appid=' . $key;

error_log(print_r($url, true));


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
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; //intval — Get the integer value of a variable
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');


echo json_encode($output); 



?>