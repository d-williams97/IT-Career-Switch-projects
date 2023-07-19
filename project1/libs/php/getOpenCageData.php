<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$countryData = $_REQUEST['countryName'];
$countryData2 = str_replace('Dem.','Democratic',$countryData);
$countryData3 = str_replace('Lao PDR', 'Lao', $countryData2);
$countryData4 = str_replace('W. Sahara', 'Western Sahara', $countryData3);
$countryData5 = str_replace('Rep.', 'Republic', $countryData4);
$countryData6 = str_replace("Côte d'Ivoire",'ci', $countryData5);
$countryData7 = str_replace("Bosnia and Herz",'ba', $countryData6);
$countryName = str_replace(' ', '%20', $countryData7);
// $countryCode = $_REQUEST['countryCode'];
error_log(print_r($countryName, true));

$executionStartTime = microtime(true);

// key = e3489716a6574283b20a91a3349be943;
// $url = 'https://api.opencagedata.com/geocode/v1/json?q=Germany&key=e3489716a6574283b20a91a3349be943&pretty=1';

// $url = 'https://api.opencagedata.com/geocode/v1/json?q=' . $countryCode . ',' . $countryName . '&key=e3489716a6574283b20a91a3349be943&pretty=1';
$url = 'https://api.opencagedata.com/geocode/v1/json?q=' . $countryName . '&key=e3489716a6574283b20a91a3349be943&pretty=1';

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