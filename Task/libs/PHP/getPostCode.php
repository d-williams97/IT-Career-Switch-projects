<?php
// Logs message to a custom log file
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);


error_log(print_r($_REQUEST['postcode'], true));
error_log(print_r($_REQUEST['country'], true));

$my_arr = array(1,2,3);
   echo '<script>';
   echo 'console.log('. json_encode($my_arr, JSON_HEX_TAG) .')';
   echo '</script>';




$executionStartTime = microtime(true);

$url = `http://api.geonames.org/postalCodeLookupJSON?postalcode={$_REQUEST['postcode']}&country={$_REQUEST['country']}&username=kwasimodo`;



$ch = curl_init();


//Console.log(function)
function console_log($output, $with_script_tags = true) {
    $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . 
');';
    if ($with_script_tags) {
        $js_code = '<script>' . $js_code . '</script>';
    }
    echo $js_code;
}
console_log($url)




?>