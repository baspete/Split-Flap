<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="css/split-flap.css"/>
    <link rel="stylesheet" href="plugins/weather/custom.css"/>
  </head>
  <body>
  
    <!-- ============================================ -->
    <!-- CHART CONTAINER                              -->
    <div id="display1" class="chartContainer splitflap">

      <!-- parameters -->
      <div class="chartPrefs" style="display:none;">
        <input type="hidden" name="data" value="<?php echo $_GET["data"] ?>" /> <!-- the station identifier -->
        <input type="hidden" name="sort" value="<?php echo $_GET["sort"] ?>" />
      </div>
      
      <ul id="chart1" class="chart">
        
        <h1>Stations near <?php echo $_GET["data"] ?></h1>
  
        <!-- Header: 30px/char, 15px/separator, 120px/logo -->
        <div class="header" style="width:120px;margin-left:0px;">Station</div>
        <div class="header" style="width:90px;margin-left:30px;">Temp</div>
        <div class="header" style="width:90px;margin-left:30px;">Wdir</div>
        <div class="header" style="width:60px;margin-left:30px;">Wspd</div>
        <div class="header" style="width:150px;margin-left:30px;">Pressure</div>
        <div class="header" style="width:470px;margin-left:30px;text-align:left;">Sky</div>

        <!-- rows will be placed here dynamically from #row_template -->
        
      </ul>

    </div>
    <!-- END CHART CONTAINER                          -->
    <!-- ============================================ -->

    <script type="text/javascript" src="js/jquery-1.7.1-min.js"></script>
    <script type="text/javascript" src="js/underscore.js"></script>
    <script type="text/javascript" src="js/backbone.js"></script>
    <script type="text/javascript" src="js/split-flap-mvc.js"></script>
    <script type="text/javascript" src="plugins/weather/custom.js"></script>

    <!-- ============================================ -->
    <!-- ROW TEMPLATE                                 -->
    <script type="text/template" id="row_template">
      <li class="row" id="<%= id %>">
        <div class="group id"> <!-- Station ID -->
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
        </div>
        <div class="group temp_f">
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
        </div>
        <div class="group wind_degrees"> 
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
        </div>
        <div class="group wind_mph"> 
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
        </div>
        <div class="group pressure_mb" style="margin-right:0;"> 
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
        </div>
        <div class="group pressure_trend"> 
          <div class="full"><span></span></div>
        </div>
        <div class="group weather_icon"> <!-- sky icon -->
          <div class="image"><span></span></div>
        </div>
        <div class="group weather"> 
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
        </div>
        <div class="group status" style="margin-right:30px;"> <!-- lights -->
          <div class="s0"></div>
          <div class="s1"></div>
        </div>
      </li>
    </script>
    <!-- END ROW TEMPLATE                             -->
    <!-- ============================================ -->

    <script type="text/javascript">

      // This Collection holds the station Models. 
      // It tells its models to fetch() their data at set intervals. 
      var Stations = Backbone.Collection.extend({
        initialize: function(){
          var stations = this.models; // need access inside functions

          // This function fetches models sequentially, 
          // much the way a real Solari board controller works.
          var fetchModels = function(models) {
            var i=0;
            var loop = function() {
              setTimeout(function () {
                models[i].fetch({dataType:sf.plugins.wunderground.dataType});
                i++;
                if (i < models.length) {
                  loop(i); 
                }
               }, 500); // sequence interval
            };
            loop();
          };

          // Fetch the models and repeat at intervals
          fetchModels(stations);
          setInterval(function(){
            fetchModels(stations);
          }, 30000); // refresh inteval
        } // end initialize
      });

      // Here's the Model for an individual station. It calls the formatStationData() plugin
      // so its JSON can be passed directly to sf.display.loadRow()
      var Station = Backbone.Model.extend({
        parse: function(json){
          return(sf.plugins.wunderground.formatStationData(json)); 
        }
      });

      // Here's the View for an individual station. When it detects a change
      // in its model it re-renders itself into its row by calling sf.display.loadRow().
      var StationView = Backbone.View.extend({
        template: _.template($('#row_template').html()),
        initialize: function(){
          // create the row markup and insert it into the container.
          $("#chart1").append(this.template({"id":this.model.id})); // could send the whole model, but why?
          this.el = $("#"+this.model.id);
          // initialize sf.display for this row
          sf.display.initRow(this.el);
          // anytime this model changes, re-render this row
          this.model.bind("change", this.render, this);
        },
        render: function(){
          sf.display.loadRow(this.model.toJSON(),this.el);
        }
      });

      $(document).ready(function() {
 
        // Get the sort prefs from the markup
        var container = $("#display1");
        var dataOptions = {
          "sort": container.find("input[name=sort]").val(),
          "order": container.find("input[name=order]").val(),
          "truncate": container.find("input[name=truncate]").val(),
          "maxResults": container.find("input[name=maxResults]").val()
        };

        // start by getting the list of nearby stations 
        // and creating a collection of objects
        $.ajax({
          url: sf.plugins.wunderground.stationsUrl("<?php echo $_GET["data"] ?>", "<?php echo $_GET["apiKey"] ?>"),
          dataType: sf.plugins.wunderground.dataType,
          success: function(response){
            var stations = new Stations; // Create a Collection

            // set up the correct sorting/truncating criteria
            // TODO: because the Models are tied to DOM elements which don't
            // change, there is currently no way to re-sequence them when 
            // refreshing the data on the page. How to solve this?
            /*
            stations.comparator = function(station) {
              var sort = dataOptions["sort"] ? dataOptions["sort"] : "id";
              return station.get(sort);
            };
            */

            // create a Model for each station code
            var codes = sf.plugins.wunderground.formatStationsData(response); // Format the response to get just the array of station codes
            for (var i=0;i<codes.length;i++){
              var station = new Station({id:codes[i]}); 
              var stationView = new StationView({model:station});
              station.url = sf.plugins.wunderground.stationUrl(codes[i], "<?php echo $_GET["apiKey"] ?>"); 
              stations.add(station); // Add the station to the Collection
            }
          },
          statusCode: {
            404: function() {
              $("#chart1").html("<h1>Station <?php echo $_GET["data"] ?> Not Found</h1>")
            }
          }
        });        

      }); // end document ready
      
    </script>

  </body>
</html>