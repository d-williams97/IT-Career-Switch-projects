<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$searchQuery = $_REQUEST['city'];
$searchQuery1 = str_replace(' ','%20',$searchQuery);
$searchQuery1 = str_replace(',','',$searchQuery1);

$city = trim($searchQuery1);

error_log(print_r($city, true));




$executionStartTime = microtime(true);

 $url = 'http://api.weatherapi.com/v1/forecast.json?key=470223832314483eafa150451230708&q=' . $city . '&days=3&aqi=no&alerts=no';





$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
curl_setopt($ch, CURLOPT_URL, $url);
$result = curl_exec($ch); 
curl_close($ch);

$decode = json_decode($result, true);
$data['forecast'] = $decode['forecast']['forecastday'];
$data['lastUpdate'] = $decode['current']['last_updated'];

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; //intval — Get the integer value of a variable
$output['data'] = $data;

header('Content-Type: application/json; charset=UTF-8');


echo json_encode($output); 



?>