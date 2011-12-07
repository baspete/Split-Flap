<html>
  <head>
    <link rel="stylesheet" href="css/airport.css"/>
  </head>
  <body>
  

    <!-- ============================================ -->
    <!-- CHART CONTAINER                              -->
    <div id="display1" class="chartContainer splitflap">

      <!-- parameters -->
      <div class="chartPrefs" style="display:none;">
        <input type="hidden" name="data" value="<?php echo $_GET["data"] ?>" />    <!-- the station identifier -->
      </div>
      
      <ul id="chart1" class="chart">
        
        <h1><?php echo $_GET["data"] ?></h1>
  
        <!-- Header: 30px/char, 15px/separator, 120px/logo -->
        <div class="header" style="width:120px;margin-left:0px;">Station</div>

        <!-- rows will be placed here dynamically from #row_template -->
        
      </ul>

      <p style="text-align:center;"><a href="#" id="clear">Clear Board</a></p>

    </div>
    <!-- END CHART CONTAINER                          -->
    <!-- ============================================ -->

    <script type="text/javascript" src="js/jquery-1.7.1-min.js"></script>
    <script type="text/javascript" src="js/underscore.js"></script>
    <script type="text/javascript" src="js/backbone.js"></script>
    <script type="text/javascript" src="js/split-flap.js"></script>

    <!-- ============================================ -->
    <!-- ROW TEMPLATE                                 -->
    <script type="text/template" id="row_template">
      <li class="row">
        <div class="group label"> <!-- Station ID -->
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
        </div>
      </li>
    </script>
    <!-- END ROW TEMPLATE                             -->
    <!-- ============================================ -->

    <script type="text/javascript">

      // This View generates the empty markup for the rows
      // It is only called once, at document.ready()
      var Board = Backbone.View.extend({
        el: $("#chart1"),
        template: _.template($('#row_template').html()),
        initialize: function(){
          this.render();
        },
        render: function() {
          this.el.find(".row").remove();
          for(var i=0;i<(sf.local.numRows?sf.local.numRows:3);i++){
            this.el.append(this.template());
          }
          return this;
        }
      });

      var Stations = Backbone.Collection.extend({
        loaded: function(){
          console.log("Stations: ",this.models)
        }
      });
      var Station = Backbone.Model.extend({
        update: function(){
          console.log("updated", this)
        }
      });

      // Utility method to clear the board
      $("#clear").click(function(){
        sf.display.clear($('#display1'));
      });

      $(document).ready(function() {
        
        // Set the number of rows to create (defaults to 3).
        sf.local.numRows = 2;

        // generate the empty rows markup (a backbone View)
        var board = new Board;
        sf.display.init();
        
        // get the sort, etc. params
        var container = $("#display1");
        var stationId = container.find("input[name=data]").val();
        var dataOptions = {
          "sort": container.find("input[name=sort]").val(),
          "order": container.find("input[name=order]").val(),
          "truncate": container.find("input[name=truncate]").val(),
          "maxResults": container.find("input[name=maxResults]").val()
        };
        
        // start by getting the list of nearby stations 
        // and creating a collection of objects
        $.ajax({
          url: sf.plugins.wunderground.stationsUrl("KOAK"),
          dataType: 'jsonp',
          success: function(response){
            var codes = sf.plugins.wunderground.formatStationsData(response); // an array of icao station codes
            var stations = new Stations; // Collection
            for (var i=0;i<codes.length;i++){
              station = new Station; // Model
              station.url = sf.plugins.wunderground.stationUrl(codes[i]);
              station.fetch({
                dataType: 'jsonp',
                success: function(response){
                  stations.models.push(station);
                  if(stations.models.length === (codes.length-1)){
                    console.log("finished");
                    stations.loaded(); // custom function to get things going TODO: have something else call this so we can iterate
                  }
                }
              });
            }
          }
        });        

       });
      
    </script>

  </body>
</html>