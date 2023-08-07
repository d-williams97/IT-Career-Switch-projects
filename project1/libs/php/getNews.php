<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$searchQuery = ($_REQUEST['countryCode']);
$searchQuery1 = str_replace('-99','SO',$searchQuery);
// $searchQuery2= str_replace('Rep.', 'Republic', $searchQuery1);
$countryCode = trim($searchQuery1);

// error_log(print_r($countryCode, true));



$executionStartTime = microtime(true);

// $url = 'https://api.worldnewsapi.com/search-news?source-countries=' . $countryCode . '&sort=publish-time&sort-direction=DESC&api-key=020404d9462345b4a98b08e58761fa73';

$url = 'https://api.newscatcherapi.com/v2/latest_headlines?';
$params = array(
    'countries' => $countryCode,
    // 'when' => '1m',
    'page_size' => 5, // Adjust the number of articles you want to retrieve
    'lang' => 'en',
    'ranked_only' => True,
    'topic' => 'news'
);

$url .= http_build_query($params); // appending params to url
$headers = array(
    'x-api-key: GxBBgzWMWCQ_LBhogEh9_zk2s4bApMmNQokib4EoA-g' // Replace with your actual API key
);


$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); // sets the headers for the HTTP request.


$result = curl_exec($ch); 
curl_close($ch);    




$decode = json_decode($result); 



$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; 
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8'); 

echo json_encode($output); 

//API has 50 call limit it 24 hours.


?>