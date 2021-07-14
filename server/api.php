<?php

class API
{
	
	function __construct($aLink)
	{
	    $this->region = $aLink['region'];
	    $this->path = $aLink['path'];
	    $this->jsonSavePath = $aLink['jsonSavePath'];
	    $this->finalResult = "";
	}

	public function get(){

		try {
		
			$url = "https://" . $this->region .
					".api.riotgames.com" .
					$this->path .
					"?api_key=" . API_KEY;

			ini_set("allow_url_fopen", 1);
			
			$json = file_get_contents($url);

			if ($this->jsonSavePath) {
				$JSON = new JSON($this->jsonSavePath, $json);
				$JSON->save();
			}
		} catch(Exception $e) {
			echo $e->getMessage();
		} finally {
			$this->finalResult = $json;
		}

	}
}
?>