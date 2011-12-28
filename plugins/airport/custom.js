sf.display.ImageDrum = function() {
  this.order = [' ','AFL','AAL','BAW','DAL','UAE','KLM','DLH','RYR','UAL','AWE'];
};

sf.plugins.airport =  {

  dataType: "json",
  
  // input: map of parameters
  // output: url
  url: function(options){
    var base_url = "data/airport_schedule.php";
    return base_url + "?data="+options.data;
  },

  formatData: function(data){
    return data.response.results[0].data;
  }

};