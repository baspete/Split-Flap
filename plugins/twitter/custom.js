
sf.plugins.twitter = {
 	
  dataType: 'jsonp',

    // get tweets
    url: function(id){
      var base_url = "http://search.twitter.com/search.json";
      var from = "from:"+id;
      console.log(id)
      var data = {
        "q": from,
        "rpp": 6
      };
      return base_url + "?" + $.param(data);
    },

    formatData: function(response){
      var newResponse = [];
      for(var i=0;i<response.results.length;i++){

        // get the timestamp
        var timestamp = new Date(response.results[i].created_at);
        var hrs = timestamp.getHours();
        if(hrs < 10){
          hrs = "0"+hrs;
        }
        var mins = timestamp.getMinutes();
        if(mins < 10){
          mins = "0"+mins;
        }
        timestamp = hrs.toString() + mins.toString();

        // split the tweet text into rows of 40 chars each
        // with a timestamp only on the first one
        var text = response.results[i].text;
        var rows = text.match(/.{1,40}/g);
        for(var j=0;j<rows.length;j++){
          var row = {
            "timestamp":timestamp,
            "text":rows[j]
          };
          timestamp = "";
          newResponse.push(row);
        }
        var blankRow = {
          "text":" "
        }
        newResponse.push(blankRow);
      }
      return newResponse;
    }	
};