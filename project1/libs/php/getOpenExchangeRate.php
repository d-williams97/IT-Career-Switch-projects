<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$currencyCode = ($_REQUEST['currencyCode']);


$executionStartTime = microtime(true);


$appID = 'e9b26c51d8aa46a796b410c227bae478';

$url = 'https://openexchangerates.org/api/latest.json?app_id=' . $appID;




$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
curl_setopt($ch, CURLOPT_URL, $url);


$result = curl_exec($ch); 
curl_close($ch);



$decode = json_decode($result);

$exchangeRate = $decode->rates->$currencyCode;

error_log(print_r($decode, true));
error_log(print_r($exchangeRate, true));

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; //intval — Get the integer value of a variable
$output['data'] = $exchangeRate;

header('Content-Type: application/json; charset=UTF-8'); // header() is used to send a raw HTTP header which is stored in the response sent back with the data with echo below.

echo json_encode($output); 




?>