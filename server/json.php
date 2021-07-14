<?php

class JSON
{
	
	function __construct($jsonSavePath, $json)
	{
		$this->serverPath = "C:/xampp/htdocs/map_leaf/json";
		$this->jsonSavePath = $this->serverPath . strtolower($jsonSavePath);
		$this->json = $json;
	}

	public function save(){

		try {

			if (file_exists($this->jsonSavePath . ".json")) {
				// $diff = date_diff(filectime($this->jsonSavePath . ".json"), Date('Y-m-d'));
				// die(Date("Y-m-d H:i:s.", filectime($this->jsonSavePath . ".json"))  . "<<<<<<");
			}

			ini_set("allow_url_fopen", 1);

			$file = fopen($this->jsonSavePath . ".json", "w") or die(var_dump($file));

			fwrite($file, $this->json);
			fclose($file);

		} catch(Exception $e) {
			echo $e->getMessage();
		} finally {
			return true;
		}

	}
}
?>