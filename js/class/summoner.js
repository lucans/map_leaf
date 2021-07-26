class Summoner{

	constructor(region, id, puuid, index){
		
		this.region = new Region(region);
		this.id = id;
		this.puuid = puuid;
		this.index = index;
		
		this.getSummonerFromJSON()
		.done(function(details){
			this.data = details;
		})
		this.coordinates = this.region.getRandomJSONCoordinate(region);
	}
    
	zoom = function(){
		mymap.flyTo([this.coordinates.lat, this.coordinates.lon], 8);
	}

	getHyperRollBadgeByPosition = function(index){
		if(index <= 2){
			return ['badge_hyper', 80];
		} else if(index > 2 && index <= 10){
			return ['badge_hyper', 50];
		} else if(index > 10 && index <= 20) {
			return ['badge_purple', 25];
		} else if(index > 20 && index <= 40) {
			return ['badge_blue', 15];
		} else if(index > 40 && index <= 60) {
			return ['badge_green', 10];
		} else {
			return ['badge_gray', 5];
		}
	}

	getHyperRollBadge = function(points){
		// Grey tier – 0 points
		// Green tier – 1,400 points
		// Blue tier – 2,600 points
		// Purple tier – 3,400 points
		// Hyper tier – 4,200 points
		if(points >= 4200){
			return 'badge_hyper';
		} else if(points < 4200 && points >= 3400) {
			return 'badge_purple';
		} else if(points < 2600 && points >= 1400) {
			return 'badge_blue';
		} else if(points <= 1400) {
			return 'badge_green';
		} else {
			return 'badge_gray';
		}
	}

	getSummonerFromJSON = function(){
		
		return $.getJSON("json/summoners/" + this.id.toLowerCase() + ".json", function(summonerJsonResult){
			return summonerJsonResult;
		}).done(function(summonerJsonResult){
			return summonerJsonResult;
		}).fail(function(summonerJsonResult){
			return this.getSummonerFromAPI();
		})
		
	}
	
	getSummonerFromAPI = function(){

		let link = SERVER_PATH + "get_api.php?region=" + this.region  + "&jsonSavePath=/summoners/" + this.id + 
		"&path=/tft/summoner/v1/summoners/" + this.id;

		return $.ajax({
				type: "GET",
				url: link,
				data: {
			},
			success: function(summonerAPIResult) {
				console.log("Class Region.JS - API Sucesso get " + this.id);
				return JSON.parse(summonerAPIResult);
			}

		});

	}

	setSummonersProfileIcon = function(){

		$.getJSON("json/summoners/" + this.id.toLowerCase() + ".json", function(summonerJsonResult){
		
		}).done(function(summonerJsonResult){
			$("img." + this.id).attr('src', SUMMONER_ICON_PATH + summonerJsonResult.profileIconId + '.png')
			$("img." + this.id).click(function(){
				// getSummonerMatchsStats(region, summonerJsonResult.id, summonerJsonResult.puuid);
				// setHTMLSummonerDetails(region, summonerJsonResult.id, summonerJsonResult.puuid);
				$(".sumonner-details").fadeIn();
			})
		}).fail(function(summonerJsonResult){
			this.getSummonerFromAPI();
		})

	}

    
}