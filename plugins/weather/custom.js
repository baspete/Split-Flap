sf.display.ImageDrum = function() {
	this.order = [
	  ' ','sleet-1','partlycloudy','clear','cloudy','fog','sunny','partlycloudy-1','tstorms','snow','chancerain','chancetstorms-1','flurries',
	  'tstorms-1','partlysunny','chanceflurries','mostlycloudy','chancesnow','chancesleet','tstorms-2','rain','sleet','hazy','mostlysunny',
	  'chancetstorms','cloudy-1','chancesleet-1'
	];
};

sf.plugins.wunderground = {
 	
  dataType: 'jsonp',
  // dataType: 'json',

    // get nearby stations
    stationsUrl: function(station_code, api_key){
      var base_url = "http://api.wunderground.com/api/"+api_key+"/geolookup/q/";
      return base_url + station_code + ".json?" + "callback=myCallback";
      // var base_url = "data/geolookup/";
      // return base_url + station_code + ".json";
    },

    // get station weather info
    stationUrl: function(station_code, api_key){
      var base_url = "http://api.wunderground.com/api/"+api_key+"/conditions/q/";
      return base_url + station_code + ".json?" + "callback=myCallback";
      // var base_url = "data/conditions/";
      // return base_url + station_code + ".php";
    },

    formatStationsData: function(response){
      var stations = response.location.nearby_weather_stations.airport.station,
          i=0, stationNames=[];
      for(i=0;i<stations.length;i++){
        stationNames[i] = stations[i]["icao"];
      }
      return stationNames;
    },

    formatStationData: function(json){
      var current = json["current_observation"];
      // Modify "pressure_trend" to show arrows/space instead of +/-/0
      switch(current.pressure_trend){
        case "+": 
          current["pressure_trend"] = "↑"; 
        break;
        case "-": 
          current["pressure_trend"] = "↓"; 
        break;
        case "0": 
          current["pressure_trend"] = ""; 
        break;
      }
      // add a status field, based on the last time updated
      var age = Math.round((new Date() - new Date(current["observation_time_rfc822"])) / (60*1000));
      if(age < 30){
        current["status"] = 0;
      } else {
        current["status"] = 1;
      }
      // add a weather icon field, based on the image url
      current["weather_icon"] = _.last(current["icon_url"].split("/")).split(".")[0].replace("nt_","");
      return current;
    }	
};