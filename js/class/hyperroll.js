class HyperRoll{

    constructor(region, limit){
        this.region = region;
        this.limit = limit;
        this.list = this.getHyperRollListFromJSON();
    }

    getHyperRollListFromJSON = function(){

        return $.getJSON("json/hyperroll/" + this.region + ".json", function(){
            
            }).done(function(hyperrollJsonResult){

                hyperrollJsonResult['totalRegion'] = hyperrollJsonResult.reduce((sum, value) => sum + value.ratedRating, 0);
                
                return hyperrollJsonResult;

            }).fail(function(hyperrollJsonResult){

                return this.getHyperRollListFromAPI().done(function(hyperRollResult){                
                    this.list = hyperRollResult;

                });
            })
    }

    getHyperRollListFromAPI = function(){

        let link = SERVER_PATH + "get_api.php?region=" + this.region  + "&jsonSavePath=/hyperroll/" + this.region + "&" +
        "path=/tft/league/v1/rated-ladders/RANKED_TFT_TURBO/top";
    
            return $.ajax({
                type: "GET",
                  url: link,
                  data: {
              },
              success: function(hyperRollResult) {
                console.log("Class HyperRoll.JS - API Sucesso get " + this.region);
                return hyperRollResult;
              }
    
        });
    
    }

    createRankingHyperRollByRegion = function(index){

        console.log(this.list);

		let firstInRankClass = (index == 0) ? "first-in-ranking" : "";
		let totalRegion = 0;
		let fontRank = (index <= 2) ? "fs-" + (index + 1) : "fs-" + (index + 1);

		this.list.forEach(function(region, index){

			$(".ranking-list")
			.append(
				"<div class='accordion-item " + this.region + " animate__animated animate__bounceInLeft'>" +
					"<h2 class='accordion-header' id='heading-" + this.region + "'>" +
					  "<button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#collapse-" + region + "' aria-expanded='true' aria-controls='collapse-" + region + "'>" +
					  	
					    "<span class='badge text-light m-1 text-uppercase " + this.region + "'>" + this.region + "</span>" + 
					   	"<span class='" + fontRank + " fw-bold float-start text-dark'> " + getAreaInfo(this.region, "name") + "</span>" + 
					    "<span class='badge text-dark text-end'>" + getNumberToK(aHyperRollList.totalRegion) + " Points</span>" +

					  "</button>" +
					"</h2>" +

					"<div class='accordion-collapse collapse' id='collapse-" + this.region + "' aria-labelledby='heading-" + region + "' data-bs-parent='#accordionRankingRegion'>"+				 
						"<div class='card-group'>"+
						"</div>"+
					"</div>"+

				"</div>")

			$(".accordion-item." + this.region).click(function(){
				let randomCoordinate = getRandomJSONCoordinate(this.region);
				zoomMapIn(randomCoordinate.lat, randomCoordinate.lon, getAreaInfo(this.region, 'zoom'));
				$("#collapse-" + this.region + " .card-group").show();
				setHTMLTopSummonerRegion(this.region);
			})

			$("#spinner-loading").hide();
			$("#accordionRankingRegion").fadeIn();

		})

    }


}