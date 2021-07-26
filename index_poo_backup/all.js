$("#spinner-loading").show();
$(".sumonner-details").hide();
$("#accordionRankingRegion").hide();

const SERVER_PATH = "./server/";
const SUMMONER_ICON_PATH = "https://ddragon.leagueoflegends.com/cdn/11.14.1/img/profileicon/";
const LIMIT_GENERATE_SUMMONERS = 3;

var aRegions = new Array(
	'na1',
	'tr1',
	'euw1',
	'eun1',
	'oc1',
	'la2',
	'kr',
	'br1',
	'ru',
	'jp1',
	'la1',		
);

var mymap = {};

$(document).ready(function() {
	
	mymap = L.map('mapid', {
    	center: [25, 25],
    	zoom: 3
	});

	var link_map = 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'
	// let link_map =  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
	// var link_map = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
	// var link_map = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
	// var link_map = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'

	L.tileLayer(link_map, {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 8,
	    minZoom: 2,
	}).addTo(mymap);

	var allHyperRoll = new Array();

	aRegions.forEach(function(region, index){

		allHyperRoll[region] = new Array();
		allHyperRoll[region]['summoners'] = new Array();
		allHyperRoll[region]['totalRegion'] = String();

		var RegionClass = new Region(region);
		RegionClass.drawGeoJSON();

		var HyperRollClass = new HyperRoll(region, LIMIT_GENERATE_SUMMONERS);

		HyperRollClass.getHyperRollListFromJSON()
		.done(function(list){

			allHyperRoll[region]['summoners'].push(list);
			allHyperRoll[region]['totalRegion'] = list.totalRegion;

			// HyperRollClass.createRankingHyperRollByRegion(list);

			// console.log("Gerando " + RegionClass.name);

			// list.forEach(function(summoner, index){
				
			// 	if(index <= LIMIT_GENERATE_SUMMONERS){
					
			// 		var SummonerClass = new Summoner(region, summoner.summonerId, '', index);

			// 			SummonerClass.setSummonersProfileIcon();

			// 				// let randomCoordinate = RegionClass.getRandomJSONCoordinate();
			// 				let iconOptions = SummonerClass.getHyperRollBadgeByPosition(index);

			// 				let iconStyle = L.icon({
			// 					iconUrl: 'img/' + iconOptions[0] + '.png',
			// 					iconSize:     [20 + iconOptions[1], 20 + iconOptions[1]],
			// 					shadowSize:   [0,0], 
			// 					iconAnchor:   [0,0], 
			// 					shadowAnchor: [0,0], 
			// 					popupAnchor:  [0,0],
			// 					zIndexOffset: 1100 + iconOptions[1],
			// 					className: summoner.summonerId + " border border-secondary clickable"
			// 				})

			// 				let marker = L.marker(
			// 									[SummonerClass.coordinates.lat, SummonerClass.coordinates.lon], 
			// 									{icon: iconStyle})		   
			// 				.addTo(mymap)

			// 				if(index <= 3){
			// 					marker
			// 					.bindTooltip(SummonerClass.summonerName + " LP: " + 
			// 						SummonerClass.ratedRating, {permanent: true, direction: 'bottom'})
			// 					.openTooltip();
			// 				}

			// 	}
			// })


		})
		
		
			  console.log(allHyperRoll.sort(function(a, b) {
				return a.totalRegion > b.totalRegion ? -1 : a.totalRegion < b.totalRegion ? 1 : 0;
			  }));
			  
	})
	
	navbarStart(aRegions);

	// var firstRegionLoadRandomRegion = new Region(aRegions[getRandomInt(0, aRegions.length)].toString());
	
	// var randomCoordinate = firstRegionLoadRandomRegion.getRandomJSONCoordinate(firstRegionLoadRandomRegion);

	// console.log("Random zooming " + firstRegionLoadRandomRegion.name + " in " + firstRegionLoadRandomRegion.coordinates.lat + ", " + firstRegionLoadRandomRegion.coordinates.lon);

	// $("#collapse-" + firstRegionLoadRandomRegion.region).collapse();

	// mymap.flyTo([firstRegionLoadRandomRegion.coordinates.lat, firstRegionLoadRandomRegion.coordinates.lon], RegionClass.getAreaInfo('zoom'))

	$("#mapid").fadeIn();
	
	$("#mapid").click(function(value, index){
		$(".summoner-details").hide();
	});

	navbarStart(aRegions);

})// FINAL DOCUMENT READY

function navbarStart(aRegions){
	
	aRegions.forEach(function(region, index){

		let navbarSelectRegion = $(".navbar-select-region");
		let navbarSelectRegionDropdown = $(".dropdown-item#" + region);
		
		navbarSelectRegion
		.append("<li><a class='dropdown-item bg-default text-uppercase' id=" + region + " href='#'>" + region + "</a></li>")
		
		navbarSelectRegionDropdown
		.click(function(){
			$(".btn.navbar-select-region-option").text(region);
		})

	})
}

function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getNumberToK(n){
	return Math.round(n / 1000) + "K";
}

function setHTMLSummonerDetails(region, summonerId, puuid){

	$.getJSON("json/summoners/" + summonerId.toLowerCase() + ".json", function(summonerJsonResult){
 	
	}).done(function(summonerJsonResult){

		$(".sumonner-details .card").empty().append("<img class='img-rounded clickable rounded card-img-top " + summonerJsonResult.id + "' src='" + SUMMONER_ICON_PATH + summonerJsonResult.profileIconId + ".png' style='heigth: 500px' alt='" +  summonerJsonResult.name + "'/>" +
			"<div class='card-body text-center'>" +
				"<h5 class='card-title fs-4'>" + summonerJsonResult.name + "</h5>" +
				"<p class='card-text text-warning'><i class='fas fa-bolt text-warning'></i> <span class='badge bg-secondary fs-6'>" + summonerJsonResult.summonerLevel + "</span></p>" +
				"<a href='#' class='btn btn-primary summoner-get-more'>Get moar</a>" +
			"</div>"
		);

		$(".sumonner-details .card .btn").click(function(){			
			setHTMLSummonerLastMatchs('', region, summonerId, puuid);
		})

		
	}).fail(function(summonerJsonResult){
		
	})

}

function zoomMapIn(lat, lon, zoom){
	mymap.flyTo([lat, lon], zoom);
}
