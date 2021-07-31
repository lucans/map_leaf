<?php

error_reporting(E_ALL);
define('API_KEY', file_get_contents('key.txt'));
require_once("api.php");
require_once("json.php");

try{

	$API = new API($_REQUEST);
	$API->get();			

} catch(Exception $e) {

	echo $e->getMessage();

} finally {
	echo ($API->finalResult);
}

?>