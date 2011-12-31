
sf.plugins.twitter = {
 	
  dataType: 'jsonp',

  // get tweets
  url: function(options){
    var base_url = "http://search.twitter.com/search.json";
    // pick up the query from the page URL
    var searchString = window.location.search;
    // optionally limit results
    var maxResults = options.maxResults ? options.maxResults : options.numRows;
    return base_url + searchString + "&rpp=" + maxResults;
  },

  formatData: function(response){
    var newResponse = [];
    for(var i=0;i<response.results.length;i++){
      // console.log("Tweet Data:",response.results[i]);

      // Get the author
      var from_user = response.results[i].from_user;

      // Get the timestamp
      var today = new Date().getDate();
      var created = new Date(response.results[i].created_at);

      // status to 1 if created today
      var status = "0";
      if(today - created.getDate() > 0){
        status = "1";
      }

      // set hours and minutes
      var hrs = created.getHours();
      if(hrs < 10){
        hrs = "0"+hrs;
      }
      var mins = created.getMinutes();
      if(mins < 10){
        mins = "0"+mins;
      }
      timestamp = hrs.toString() + mins.toString();

      // Split the tweet text into rows and add each row to newResponse[] 
      // with a timestamp only on the first one
      var text = response.results[i].from_user+": "+response.results[i].text;
      var rows = sf.util.splitString(text, 50); // 50 chars for HD display
      for(var j=0;j<rows.length;j++){
        var row = {
          "timestamp":timestamp,
          "text":rows[j],
          "status":status
        };
        timestamp = "";
        from_user = "";
        status = "";
        newResponse.push(row);
      }
      // Add a blank row between tweets
      var blankRow = {
        "timestamp":"",
        "text":"",
        "status":""
      }
      newResponse.push(blankRow);
    }
    return newResponse;
  }

};