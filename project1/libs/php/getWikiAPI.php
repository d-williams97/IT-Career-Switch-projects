<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);


$searchQuery = ($_REQUEST['country']);
$searchQuery1 = str_replace('Dem.','Democratic',$searchQuery);
$searchQuery2 = str_replace('Lao PDR', 'Lao', $searchQuery1);
$searchQuery3 = str_replace('W. Sahara', 'Western Sahara', $searchQuery2);
$searchQuery4= str_replace('Rep.', 'Republic', $searchQuery3);
$searchQuery5 = str_replace("Côte d'Ivoire",'ci', $searchQuery4);
$searchQuery6 = str_replace("Bosnia and Herz.",'Bosnia and Herzegovina', $searchQuery5);
$country = str_replace(' ','%20',$searchQuery6);




error_log(print_r($country, true));



$executionStartTime = microtime(true);

$url = 'http://api.geonames.org/wikipediaSearchJSON?q=' . $country . '&maxRows=20&username=kwasimodo';

error_log(print_r($url, true));


$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
curl_setopt($ch, CURLOPT_URL, $url);


$result = curl_exec($ch); 
curl_close($ch);

error_log(print_r($result, true));


$decode = json_decode($result); // Takes a well-formed XML string and returns it as an object.

error_log(print_r($result, true));

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; //intval — Get the integer value of a variable
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8'); // header() is used to send a raw HTTP header which is stored in the response sent back with the data with echo below.

echo json_encode($output); 




?>