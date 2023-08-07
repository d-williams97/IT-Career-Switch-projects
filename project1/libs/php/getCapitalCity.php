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


error_log(print_r($decode, true));

$latLng = $decode[0]['capitalInfo']['latlng'];
$lat = $latLng[0];
$lng = $latLng[1];
$capitalCity = $decode[0]['capital'][0];

error_log(print_r($latLng, true));
error_log(print_r($capitalCity, true));

$data['lat'] = $lat;
$data['lng'] = $lng;
$data['capitalCity'] = $capitalCity;

// foreach ($decode['geonames'] as $city) {
//     // error_log(print_r($city, true));
//     $temp = null;
//     $temp['lng'] = $city['lng'];
//     $temp['lat'] = $city['lat'];
//     $temp['city'] = $city['name'];
//     $temp['population'] = $city['population'];
//     array_push($cityData,$temp);
// };


// error_log(print_r($cityData, true));


// function compare($a,$b) {
//     return ($b['population'] - $a['population']);
// }
// usort($cityData,'compare');



$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; //intval — Get the integer value of a variable
$output['data'] = $data;

header('Content-Type: application/json; charset=UTF-8'); // header() is used to send a raw HTTP header which is stored in the response sent back with the data with echo below.

echo json_encode($output); 




?>