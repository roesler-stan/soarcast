// TO DO: add Santa Barbara, Cayucos, and road trip sites

function getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge) {

    $.ajax({
		url: 'https://api.weather.gov/points/' + lat + ',' + lng + '/forecast/hourly',
		dataType: 'json',
		headers: {
	    'accept': 'application/json'
		},
		error: function (error) {
			console.log(error);
		},
		success: function (thedata) {

			var therow = '';
			var greeno = 0;
			var yellowo = 0;

			// remove the gif spinner
			$(".score img").remove();

			var d = new Date();
			var weekday = new Array(7);
			weekday[0] = "Su";
			weekday[1] = "Mo";
			weekday[2] = "Tu";
			weekday[3] = "We";
			weekday[4] = "Th";
			weekday[5] = "Fr";
			weekday[6] = "Sa";
			var todaynum = d.getDay();
			var todayhour = d.getHours();
			
			var i = 0;

			for (i = 0; i < 155; i++) { 
			
				// get the PT hour from the API hour entry 
				var timestr = thedata.properties.periods[i].startTime;
				var thehour = timestr.substring(11,13);
				var isutc = timestr.substring(20,22); // returns 00 for UTC return 
				if (isutc == '00') {
					thehour = thehour - 7;
					if (thehour < 0) {
						thehour = thehour + 24;
					}
				}

				// get the windSpeed range 
				var thespeed = thedata.properties.periods[i].windSpeed;
				var speedmin_act = 0;
				var speedmax_act = 0;
				if (thespeed.length < 7) {
					speedmin_act = thespeed.substring(0,thespeed.indexOf("mph"));
					speedmax_act = thespeed.substring(0,thespeed.indexOf("mph"));
				} else {
					speedmin_act = thespeed.substring(0,thespeed.indexOf("to"));
					speedmax_actarray = thespeed.match("to(.*)mph");
					speedmax_act = speedmax_actarray[1];
				}
				speedmin_act = parseInt(speedmin_act);
				speedmax_act = parseInt(speedmax_act);


				var thedirection = thedata.properties.periods[i].windDirection;

				if (thehour == '00') {

					// console.log("BREAK start a new day here")
					// day is over, add up for previous day 
					if (greeno >= 3) {
						therow = therow.concat('<div class="go-ideal">'+weekday[todaynum]+'</div>');

					} else if (greeno==1 || greeno == 2) {
						therow = therow.concat('<div class="go-likely">'+weekday[todaynum]+'</div>');

					} else if (yellowo >= 3) {
						therow = therow.concat('<div class="go-maybe">'+weekday[todaynum]+'</div>');

					} else {
						therow = therow.concat('<div class="go-bad">'+weekday[todaynum]+'</div>');

					}

					todaynum++;
					if (todaynum == 7) { todaynum = 0; } // loop on Sunday 

					// reset green, yellow for next period 
					greeno = 0;
					yellowo = 0;
				
				} else if (thehour >= hourstart && thehour <= hourend) {

					if ((speedmin_act >= speedmin_ideal && speedmax_act <= speedmax_ideal) && (jQuery.inArray(thedirection, dir_ideal) !== -1)) {
						// console.log(site_score+" green: T="+thehour+"("+timestr+"), windspeed "+thespeed+", direction "+thedirection+', day '+weekday[todaynum]);
						greeno = greeno+1;
						yellowo = yellowo+1;
					} else if ((speedmin_act >= speedmin_edge && speedmax_act <= speedmax_edge) && (jQuery.inArray(thedirection, dir_edge) !== -1)) {
						// console.log(site_score+" yellow: T="+thehour+"("+timestr+"), windspeed "+thespeed+", direction "+thedirection+', day '+weekday[todaynum]);
						yellowo = yellowo + 1; 
					} else {
						// console.log(site_score+" red: T="+thehour+"("+timestr+"), windspeed "+thespeed+", direction "+thedirection+', day '+weekday[todaynum]);
					}

				} 

					
			} // end for loop 

			$('#'+site_score).append(therow);
			// console.log(site_score);
			
		} // end success function

	}); // end ajax POST       

} // end function 

 
$(document).ready(function() {

	console.log('\n\n\nDocument ready \n');

	// Temp button fill in fields 
	$(".sitebox").click(function(e) {
		$(this).find('.nws_image').toggle("slow");
		$(this).find('.morestuff').toggle("slow");

			if ($(this).find('.plusexpand').text() == "+") {
            	$(this).find('.plusexpand').text("-");
	        }
	        else {
	            $(this).find('.plusexpand').text("+");
	        }
	});

	// non-local areas 
	$("#owens").click(function(e) {
		$("#owens_lee").toggle("slow");
	});

	$("#oregon").click(function(e) {
		$("#shasta").toggle("slow");
		$("#whaleback").toggle("slow");
		$("#woodrat").toggle("slow");
		$("#lakeview_blackcap").toggle("slow");
		$("#lakeview_dohertyslide").toggle("slow");
		$("#lakeview_sugarhill").toggle("slow");
		$("#lakeview_hadleybutte").toggle("slow");
		$("#pine").toggle("slow");
	});

	// TO DO: use a Google Sheet (which would also be easy to adapt to include user input)
	var site_score = '';
	var lat = 0;
	var lng = 0;
	var hourstart = 0;
	var hourend = 0;
	var speedmin_ideal = 0;
	var speedmax_ideal = 0;
	var speedmin_edge = 0;
	var speedmax_edge = 0;	
	var dir_ideal = [];
	var dir_edge = [];

	site_score = 'big_sur_score';
	lat = 35.971;
	lng = -121.453;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 2;
	speedmax_ideal = 8;
	speedmin_edge = 0;
	speedmax_edge = 11;	
	dir_ideal = ['SW', 'WSW', 'W'];
	dir_edge = ['SSW', 'SW', 'WSW', 'W', 'WNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'berkeley_score';
	lat = 37.871;
	lng = -122.319;
	hourstart = 11;
	hourend = 18;
	speedmin_ideal = 7;
	speedmax_ideal = 10;
	speedmin_edge = 6;
	speedmax_edge = 11;
	dir_ideal = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	dir_edge = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'blue_rock_score';
	lat = 38.140;
	lng = -122.217;
	hourstart = 15;
	hourend = 19;
	speedmin_ideal = 8;
	speedmax_ideal = 10;
	speedmin_edge = 7;
	speedmax_edge = 13;
	dir_ideal = ['WSW', 'W', 'WNW'];
	dir_edge = ['SW', 'WSW', 'W', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'channing_score';
	lat = 38.098;
	lng = -122.180;
	hourstart = 12;
	hourend = 19;
	speedmin_ideal = 8;
	speedmax_ideal = 10;
	speedmin_edge = 7;
	speedmax_edge = 12;
	dir_ideal = ['WSW', 'W', 'WNW'];
	dir_edge = ['SW', 'WSW', 'W', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'channing_east_score';
	lat = 38.099;
	lng = -122.180;
	hourstart = 12;
	hourend = 19;
	speedmin_ideal = 7;
	speedmax_ideal = 9;
	speedmin_edge = 5;
	speedmax_edge = 12;
	dir_ideal = ['ENE', 'E', 'ESE'];
	dir_edge = ['NE', 'ENE', 'E', 'ESE', 'SE'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'coloma_score';
	lat = 38.822;
	lng = -120.889;
	hourstart = 11;
	hourend = 18;
	speedmin_ideal = 0;
	speedmax_ideal = 6;
	speedmin_edge = 0;
	speedmax_edge = 8;
	dir_ideal = ['WSW', 'W', 'WNW'];
	dir_edge = ['SW', 'WSW', 'W', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'davis_score';
	lat = 38.570;
	lng = -121.820;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 7;
	speedmax_ideal = 10;
	speedmin_edge = 6;
	speedmax_edge = 12;
	dir_ideal = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	dir_edge = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'diablo_juniper_score';
	lat = 37.881;
	lng = -121.914;
	hourstart = 11;
	hourend = 18;
	speedmin_ideal = 0;
	speedmax_ideal = 6;
	speedmin_edge = 0;
	speedmax_edge = 10;
	dir_ideal = ['SW', 'WSW'];
	dir_edge = ['SW', 'WSW', 'W'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'diablo_towers_score';
	lat = 37.881;
	lng = -121.914;
	hourstart = 11;
	hourend = 18;
	speedmin_ideal = 3;
	speedmax_ideal = 7;
	speedmin_edge = 3;
	speedmax_edge = 10;
	dir_ideal = ['WNW', 'NW'];
	dir_edge = ['W', 'WNW', 'W', 'NW', 'NNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'day_dreams_score';
	lat = 39.242;
	lng = -120.008;
	hourstart = 12;
	hourend = 18;
	speedmin_ideal = 5;
	speedmax_ideal = 9;
	speedmin_edge = 5;
	speedmax_edge = 12;
	dir_ideal = ['SSW', 'SW', 'WSW'];
	dir_edge = ['S', 'SSW', 'SW', 'WSW', 'W'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'drakes_score';
	lat = 38.026;
	lng = -122.965;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 8;
	speedmax_ideal = 12;
	speedmin_edge = 7;
	speedmax_edge = 18;
	dir_ideal = ['SE', 'SSE'];
	dir_edge = ['ESE', 'SE', 'SSE', 'S'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'dunlap_score';
	lat = 36.765;
	lng = -119.098;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 0;
	speedmax_ideal = 7;
	speedmin_edge = 0;
	speedmax_edge = 11;
	dir_ideal = ['WSW', 'W', 'WNW'];
	dir_edge = ['SW', 'WSW', 'W', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);
	
	site_score = 'duck_hill_score';
	lat = 39.241;
	lng = -119.741;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 2;
	speedmax_ideal = 6;
	speedmin_edge = 0;
	speedmax_edge = 10;
	dir_ideal = ['SW','WSW', 'W', 'WNW', 'NW'];
	dir_edge = ['WSW', 'W', 'WNW', 'NW', 'NNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'ed_levin_score';
	lat = 37.475;
	lng = -121.861;
	hourstart = 9;
	hourend = 18;
	speedmin_ideal = 0;
	speedmax_ideal = 8;
	speedmin_edge = 0;
	speedmax_edge = 13;
	dir_ideal = ['SSE', 'S', 'SSW', 'SW', 'WSW', 'W'];
	dir_edge = ['SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'elk_score';
	lat = 39.277;
	lng = -122.941;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 0;
	speedmax_ideal = 6;
	speedmin_edge = 0;
	speedmax_edge = 9;
	dir_ideal = ['ESE','SE','SSE','NW', 'WNW'];
	dir_edge = ['ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'goat_score';
	lat = 38.443;
	lng = -123.122;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 9;
	speedmax_ideal = 13;
	speedmin_edge = 8;
	speedmax_edge = 15;
	dir_ideal = ['WSW', 'W', 'WNW'];
	dir_edge = ['SW', 'WSW', 'W', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'hat_creek_score';
	lat = 40.842;
	lng = -121.428;
	hourstart = 15;
	hourend = 19;
	speedmin_ideal = 5;
	speedmax_ideal = 9;
	speedmin_edge = 3;
	speedmax_edge = 12;
	dir_ideal = ['WSW', 'W', 'WNW'];
	dir_edge = ['SW', 'WSW', 'W', 'WNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'hull_score';
	lat = 39.509;
	lng = -122.937;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 2;
	speedmax_ideal = 6;
	speedmin_edge = 0;
	speedmax_edge = 8;
	dir_ideal = ['SSW', 'SW', 'WSW'];
	dir_edge = ['S', 'SSW', 'SW', 'WSW', 'W'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'indian_valley_score';
	lat = 40.194;
	lng = -120.923;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 3;
	speedmax_ideal = 7;
	speedmin_edge = 0;
	speedmax_edge = 9;
	dir_ideal = ['SSW', 'SW', 'WSW'];
	dir_edge = ['S', 'SSW', 'SW', 'WSW', 'W'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'lakeview_blackcap_score';
	lat = 42.204264;
	lng = -120.330122;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 2;
	speedmax_ideal = 7;
	speedmin_edge = 0;
	speedmax_edge = 10;	
	dir_ideal = ['WSW', 'W'];
	dir_edge = ['SW', 'WSW', 'W', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'lakeview_dohertyslide_score';
	lat = 42.019267;
	lng = -119.485666;
	hourstart = 16;
	hourend = 19;
	speedmin_ideal = 4;
	speedmax_ideal = 7;
	speedmin_edge = 3;
	speedmax_edge = 10;	
	dir_ideal = ['WSW', 'W', 'WNW'];
	dir_edge = ['WSW', 'W', 'WNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'lakeview_sugarhill_score';
	lat = 41.806527;
	lng = -120.328704;
	hourstart = 10;
	hourend = 19;
	speedmin_ideal = 2;
	speedmax_ideal = 7;
	speedmin_edge = 3;
	speedmax_edge = 8;	
	dir_ideal = ['WSW', 'SW'];
	dir_edge = ['WSW', 'W', 'SW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'lakeview_hadleybutte_score';
	lat = 42.690833;
	lng = -120.666117;
	hourstart = 10;
	hourend = 19;
	speedmin_ideal = 2;
	speedmax_ideal = 7;
	speedmin_edge = 0;
	speedmax_edge = 9;	
	dir_ideal = ['N', 'NNE', 'NNW'];
	dir_edge = ['N', 'NNE', 'NE', 'NW', 'NNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'lagoonkite_score';
	lat = 38.333;
	lng = -122.002;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 7;
	speedmax_ideal = 11;
	speedmin_edge = 6;
	speedmax_edge = 13;
	dir_ideal = ['S', 'SSW','SW', 'WSW', 'W', 'WNW','NW', 'NNW'];
	dir_edge = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'lagoon_score';
	lat = 38.333;
	lng = -122.002;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 7;
	speedmax_ideal = 11;
	speedmin_edge = 6;
	speedmax_edge = 13;
	dir_ideal = ['SW', 'WSW', 'W', 'WNW'];
	dir_edge = ['SSW', 'SW', 'WSW', 'W', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'mussel_rock_score';
	lat = 37.674;
	lng = -122.495;
	hourstart = 11;
	hourend = 18;
	speedmin_ideal = 9;
	speedmax_ideal = 14;
	speedmin_edge = 8;
	speedmax_edge = 20;
	dir_ideal = ['WSW', 'W', 'WNW'];
	dir_edge = ['SW', 'WSW', 'W', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'mt_tam_score';
	lat = 37.911;
	lng = -122.625;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 2;
	speedmax_ideal = 8;
	speedmin_edge = 0;
	speedmax_edge = 12;
	dir_ideal = ['S', 'SSW', 'SW', 'WSW', 'W'];
	dir_edge = ['SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'mission_score';
	lat = 37.518;
	lng = -121.892;
	hourstart = 9;
	hourend = 18;
	speedmin_ideal = 0;
	speedmax_ideal = 8;
	speedmin_edge = 0;
	speedmax_edge = 12;
	dir_ideal = ['SW', 'WSW', 'W', 'WNW', 'NW'];
	dir_edge = ['SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'N'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'owens_lee_score';
	lat = 37.9763;
	lng = -119.1680;
	hourstart = 9;
	hourend = 13;
	speedmin_ideal = 0;
	speedmax_ideal = 6;
	speedmin_edge = 0;
	speedmax_edge = 8;	
	dir_ideal = ['E', 'ENE'];
	dir_edge = ['NE', 'ENE', 'E', 'ESE', 'SE'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'oroville_score';
	lat = 39.537;
	lng = -121.628;
	hourstart = 11;
	hourend = 18;
	speedmin_ideal = 7;
	speedmax_ideal = 10;
	speedmin_edge = 6;
	speedmax_edge = 12;
	dir_ideal = ['N', 'NNW'];
	dir_edge = ['N', 'NNE', 'NNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'pine_score';
	lat = 43.819367;
	lng = -120.932833;
	hourstart = 10;
	hourend = 19;
	speedmin_ideal = 2;
	speedmax_ideal = 7;
	speedmin_edge = 0;
	speedmax_edge = 9;	
	dir_ideal = ['W', 'WNW', 'NW'];
	dir_edge = ['WSW', 'W', 'WNW', 'NW', 'NNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'potato_score';
	lat = 39.3317;
	lng = -122.685;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 2;
	speedmax_ideal = 5;
	speedmin_edge = 0;
	speedmax_edge = 8;
	dir_ideal = ['ENE', 'E'];
	dir_edge = ['NE', 'ENE', 'E', 'ESE', 'SE'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'sand_city_score';
	lat = 36.626;
	lng = -121.844;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 9;
	speedmax_ideal = 13;
	speedmin_edge = 7;
	speedmax_edge = 18;
	dir_ideal = ['WSW', 'W','WNW'];
	dir_edge = ['SW', 'WSW', 'W', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'shasta_score';
	lat = 41.377;
	lng = -122.195;
	hourstart = 7;
	hourend = 12;
	speedmin_ideal = 0;
	speedmax_ideal = 6;
	speedmin_edge = 0;
	speedmax_edge = 9;	
	dir_ideal = ['SSW', 'SW', 'WSW'];
	dir_edge = ['S', 'SSW', 'SW', 'WSW', 'W'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'shoreline_score';
	lat = 37.430;
	lng = -122.076;
	hourstart = 9;
	hourend = 19;
	speedmin_ideal = 7;
	speedmax_ideal = 11;
	speedmin_edge = 5;
	speedmax_edge = 13;	
	dir_ideal = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	dir_edge = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'slide_score';
	lat = 39.319;
	lng = -119.867;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 2;
	speedmax_ideal = 6;
	speedmin_edge = 0;
	speedmax_edge = 8;
	dir_ideal = ['ENE', 'E', 'ESE'];
	dir_edge = ['NE', 'ENE', 'E', 'ESE', 'SE'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'st_helena_score';
	lat = 38.667;
	lng = -122.628;
	hourstart = 11;
	hourend = 18;
	speedmin_ideal = 3;
	speedmax_ideal = 7;
	speedmin_edge = 0;
	speedmax_edge = 10;
	dir_ideal = ['SW', 'WSW'];
	dir_edge = ['S', 'SSW', 'SW', 'WSW', 'W'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'tollhouse_score';
	lat = 37.015;
	lng = -119.373;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 3;
	speedmax_ideal = 7;
	speedmin_edge = 0;
	speedmax_edge = 10;
	dir_ideal = ['SW', 'WSW', 'W'];
	dir_edge = ['SSW', 'SW', 'WSW', 'W', 'WNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'vallejo_score';
	lat = 38.102;
	lng = -122.264;
	hourstart = 9;
	hourend = 19;
	speedmin_ideal = 7;
	speedmax_ideal = 11;
	speedmin_edge = 6;
	speedmax_edge = 14;	
	dir_ideal = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	dir_edge = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'whaleback_score';
	lat = 41.535;
	lng = -122.153;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 0;
	speedmax_ideal = 8;
	speedmin_edge = 0;
	speedmax_edge = 11;
	dir_ideal = ['WSW', 'W', 'WNW'];
	dir_edge = ['SW', 'WSW', 'W', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'waddel_score';
	lat = 37.089;
	lng = -122.274;
	hourstart = 12;
	hourend = 18;
	speedmin_ideal = 7;
	speedmax_ideal = 9;
	speedmin_edge = 7;
	speedmax_edge = 12;
	dir_ideal = ['WSW', 'W', 'WNW'];
	dir_edge = ['WSW', 'W', 'WNW', 'NW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'windy_score';
	lat = 37.364;
	lng = -122.245;
	hourstart = 10;
	hourend = 18;
	speedmin_ideal = 2;
	speedmax_ideal = 6;
	speedmin_edge = 0;
	speedmax_edge = 10;
	dir_ideal = ['ENE', 'E'];
	dir_edge = ['NE', 'ENE', 'E', 'ESE', 'SE'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);

	site_score = 'woodrat_score';
	lat = 42.2313;
	lng = -123.0037;
	hourstart = 11;
	hourend = 18;
	speedmin_ideal = 0;
	speedmax_ideal = 7;
	speedmin_edge = 0;
	speedmax_edge = 10;	
	dir_ideal = ['N', 'W', 'WNW', 'NW', 'NNW'];
	dir_edge = ['N', 'NNE', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	getForecast(site_score, lat, lng, hourstart, hourend, speedmin_ideal, speedmax_ideal, speedmin_edge, speedmax_edge, dir_ideal, dir_edge);


}); // end document ready 

