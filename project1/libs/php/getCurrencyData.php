<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$searchQuery = ($_REQUEST['countryCode']);
$searchQuery1 = str_replace('-99','SO',$searchQuery);
$countryCode = trim($searchQuery1);


$executionStartTime = microtime(true);


$url = 'https://restcountries.com/v3.1/alpha/' . $countryCode;


$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
curl_setopt($ch, CURLOPT_URL, $url);


$result = curl_exec($ch); 
curl_close($ch);


$decode = json_decode($result, true);

$currencies = $decode[0]['currencies'];


// error_log(print_r($currencies, true));

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; //intval — Get the integer value of a variable
$output['data'] = $currencies;

header('Content-Type: application/json; charset=UTF-8'); // header() is used to send a raw HTTP header which is stored in the response sent back with the data with echo below.

echo json_encode($output); 




?>