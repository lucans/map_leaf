<?

class Dao
{
	
	function __construct($region = 'br1', $locale = 'pt_BR', $version = 'v1', $limit = 10){
		$this->region = $region;
		$this->locale = $locale;
		$this->version = $version;
		if ($_SERVER['HTTP_HOST'] == 'localhost') {
			$this->link = mysqli_connect("localhost", "root", "", "db_riot");
		} else {
			$this->link = mysqli_connect("sql177.main-hosting.eu", "u895930438_tft_map", "H&KvO3q;5r", "u895930438_tft_map");
		}

		$this->limit = $limit;
	}

	public function convertPlatformToRegional(){
		if (array_search($this->region, ['br1', 'la1', 'la2', 'na1'])) {
			return 'americas';
		} else if(array_search($this->region, ['eun1', 'euw1', 'ru', 'tr1'])){
			return 'europe';
		} else if(array_search($this->region, ['kr', 'jp1'])){
			return 'asia';
		}
		return $this->region;

	}

	public function getURL($url, $debug = ''){

		$url = str_replace("version", $this->version, $url);

		$final_url = "https://" . $this->region . ".api.riotgames.com/" . $url . "?api_key=" . API_KEY;
		
		if ($debug == 'die') { die($final_url); }

		try {
			
			ini_set("allow_url_fopen", 1);
			$json = file_get_contents($final_url);
			$result = json_decode($json);

		} catch (Exception $e) {
			return print_r($result);
		} finally{
			return $result;
		}

	}

	public function filterError($error){
		if (strstr($error, 'Duplicate entry')) {
			return 'Duplicated';
		}
	}

	public function insert($aInsert, $debug = ''){

		$aResult = array(
			'status' => '',
			'message' => '',
			'results' => array()
		);

		if ($debug == 'die') { die(print_r($aInsert)); }

		try {
			foreach ($aInsert as $key => $query) {
				if ($result = mysqli_query($this->link, $query)) {
					$aResult['status'] = 'success';
					$aResult['message'] = mysqli_error($this->link);
					$aResult['last_insert_id'] = mysqli_insert_id($this->link);
				} else{
					$aResult['status'] = 'error';
					$aResult['message'] = $this->filterError(mysqli_error($this->link)) . print_r(mysqli_error($this->link));
					throw new Exception(print_r($aResult), 1);
				}
			}	
		} catch (Exception $e) {
			return print_r(mysqli_error($this->link));
		} finally{
			return $aResult;
		}
		
	}


	public function update($aUpdate, $debug = ''){

		if ($debug == 'die') { die(print_r($aUpdate)); }

		try {
			foreach ($aUpdate as $key => $query) {
				mysqli_query($this->link, $query);
			}	
		} catch (Exception $e) {
			return print_r(mysqli_error($this->link));
		} finally{
			return true;
		}
		
	}

	public function getFromDB($sQuery, $debug = ''){

		$aResult = array();
		$aResult['results'] = array();
		$aResult['status'] = array();
		
		if ($debug == 'die') { die(print_r($sQuery)); }

		try {
			$result = mysqli_query($this->link, $sQuery);
			foreach ($result as $key => $value) {
				array_push($aResult['results'], $value);
			}
		} catch (Exception $e) {
			return print_r(mysqli_error($this->link));
		} finally{

			if (count($aResult['results']) <= 1) {
				return $aResult['results'][0];
			} else {
				return $aResult['results'];
			}
		}
	}



	public function getFromDBArray($aQuerys, $debug = ''){

		$aResult = array();

		if($debug == 'die') { 
			print_r($aQuerys); die();
		}

		try {

			foreach ($aQuerys as $key1 => $sQuery) {
				$result = mysqli_query($this->link, $sQuery);
				foreach ($result as $key2 => $value) {
					$aResult[$key1][] = $value;
				}
			}

		} catch (Exception $e) {
			return $e->getMessage() . " - " . mysqli_error($this->link);
		} finally{
			return $aResult;
		}
	}
}
?>