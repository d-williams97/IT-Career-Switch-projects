<?php
// Logs message to a custom log file
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);


$postalcode = $_REQUEST['postcode'];
$postalcode = str_replace(' ','',$postalcode);
$country = $_REQUEST['country'];

error_log(print_r($postalcode, true));
error_log(print_r($country, true));


$executionStartTime = microtime(true);

$url = 'http://api.geonames.org/postalCodeLookupJSON?postalcode=' . $postalcode . '&country=' . $country . '&username=kwasimodo';

// function console_log($output, $with_script_tags = true) {
//     $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . 
// ');';
//     if ($with_script_tags) {
//         $js_code = '<script>' . $js_code . '</script>';
//     }
//     echo $js_code;
// }

// console_log($url);


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

header('Content-Type: application/json; charset=UTF-8'); // header() is used to send a raw HTTP header which is stored in the response sent back with the data with echo below.

echo json_encode($output); 


// error_log(print_r($decode), true);










?>