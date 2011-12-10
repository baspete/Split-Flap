sf.display.ImageDrum = function() {
  this.order = [' ','0','1','2','3','4','5','6','7','8','9'];
};

sf.plugins.airport =  {
    
    // input: map of parameters
    // output: url
    url: function(params){
      var base_url = "data/airport_schedule.php";
      return base_url + "?" + params.serialize();
    },

    formatData: function(data){
      var formattedData = data.response.results[0].data;
      return formattedData;
    }

  }

};