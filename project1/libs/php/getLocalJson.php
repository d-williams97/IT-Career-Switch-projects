<?php 
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);


$executionStartTime = microtime(true);

$localJsonFilePath = dirname(__DIR__) . '/assets/countryBorders.geo.json';
$jsonData = file_get_contents($localJsonFilePath);

// ---------PROCESSING JSON DATA --------//

$decodedJson = json_decode($jsonData, true);


// if check//

$countryArr = $decodedJson['features'];

function countryFunc($country) {
    $obj = new stdClass;
    $obj->countryName = $country['properties']['name'];
    $obj->ISO = $country['properties']['iso_a2'];
    $obj->polygon = $country['geometry']['coordinates'];
    // error_log(print_r($obj, true));
    return $obj;
};
$countryData = array_map('countryFunc',$countryArr);

//U_Sort an array by values using a user-defined comparison function//

function compare($a,$b) {
    return strcmp($a->countryName, $b->countryName) ;
}
usort($countryData,'compare');


// error_log(print_r($countryData, true));


$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; //intval — Get the integer value of a variable
$output['data'] = $countryData;


header('Content-Type: application/json; charset=UTF-8'); // header() is used to send a raw HTTP header which is stored in the response sent back with the data with echo below.

// echo json_encode($output); 
echo json_encode($output); 


?>