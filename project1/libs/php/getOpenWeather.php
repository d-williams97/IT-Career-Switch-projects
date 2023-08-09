<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$searchQuery = $_REQUEST['city'];
$searchQuery1 = str_replace(' ', '%20', $searchQuery);
$searchQuery2 = str_replace(',', '', $searchQuery1);
$searchQuery3 = str_replace('Naypyidaw', 'Yangon', $searchQuery2);

$city = trim($searchQuery3);

// error_log(print_r($city, true));

$executionStartTime = microtime(true); // Returns current unix timestamp

$url = 'http://api.weatherapi.com/v1/forecast.json?key=470223832314483eafa150451230708&q=' . $city . '&days=3&aqi=no&alerts=no';


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
$result = curl_exec($ch);
$cURLERROR = curl_errno($ch);
curl_close($ch);


if ($cURLERROR) {
    $output['status']['code'] = $cURLERROR;
    $output['status']['name'] = 'Fail - cURL';
    $output['status']['description'] = curl_strerror($cURLERROR);
    $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3); 
    $output['data'] = $data;
} else {

    // Attempt to serlaise cURL result to an associative array to check content is present before appending to output array.
    $decode = json_decode($result, true);
    // error_log(print_r($decode, true));

    // If there is a JSON error when serialising data 
    if (json_last_error() !== JSON_ERROR_NONE) { 
        $output['status']['code'] = json_last_error();
        $output['status']['name'] = "Failure - JSON";
        $output['status']['description'] = json_last_error_msg();
        $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
        $output['data'] = null;
    } else {
        if (isset($decode['error'])) { // isset determines if set variable is declared and is different than null
            $output['status']['code'] = $decode['error']['code'];
            $output['status']['name'] = "API Failure";
            $output['status']['description'] = $decode['error']['message'];
            $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
            $output['data'] = null;
        } else {
            $data['forecast'] = $decode['forecast']['forecastday'];
            $data['lastUpdate'] = $decode['current']['last_updated'];

            $output['status']['code'] = "200";
            $output['status']['name'] = "ok";
            $output['status']['description'] = "success";
            $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; 
            $output['data'] = $data;
        }
    }
}


header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
