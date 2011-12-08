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
        
        <h1>Stations near <?php echo $_GET["data"] ?></h1>
  
        <!-- Header: 30px/char, 15px/separator, 120px/logo -->
        <div class="header" style="width:120px;margin-left:0px;">Station</div>

        <!-- rows will be placed here dynamically from #row_template -->
        
      </ul>

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
      <li class="row" id="<%= id %>">
        <div class="group label"> <!-- Station ID -->
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
        <div class="group wind_dir"> 
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
          <div class="character"><span></span></div>
        </div>
        <div class="group wind_mph"> 
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
        </div>
      </li>
    </script>
    <!-- END ROW TEMPLATE                             -->
    <!-- ============================================ -->

    <script type="text/javascript">

      var Stations = Backbone.Collection.extend({
        initialize: function(){
          this.bind("change",function(eventName){
            console.log("collection changed: ",eventName)
          },this);
        }
      });

      var Station = Backbone.Model.extend({
        initialize: function(){
          var station = this;
          setInterval(function(){
            console.log("fetching model ",station.id)
            station.fetch();
          }, 5000); // refresh inteval
        },
        normalize: function(){
          var observation = this.get("current_observation");
          var normalizedData = {}
          normalizedData = {
            "label":this.id,
            "data":{
              "temp_f": observation.temp_f,
              "wind_dir": observation.wind_dir,
              "wind_mph": observation.wind_mph
            }
          };
          return normalizedData;
        }
      });

      var StationView = Backbone.View.extend({
        template: _.template($('#row_template').html()),
        initialize: function(){
          $("#chart1").append(this.template({"id":this.model.id})); // could send the whole model, but why?
          this.el = $("#"+this.model.id);
          sf.display.initRow(this.el);
          this.model.bind("change", this.render, this);
        },
        render: function(){
          // console.log("rendering view: ",this.model.id, "with data: ",this.model.normalize() );
          sf.display.loadRow(this.model.normalize(),$("#"+this.model.id));
        }
      });

      $(document).ready(function() {
 
        // start by getting the list of nearby stations 
        // and creating a collection of objects
        $.ajax({
          url: sf.plugins.wunderground.stationsUrl("<?php echo $_GET["data"] ?>"),
          // dataType: 'jsonp',
          dataType: 'json',
          success: function(response){
            var codes = sf.plugins.wunderground.formatStationsData(response);
            var l = codes.length;
            var s = []; // a temporary array to hold models - we'll create the collection when this is full
            var i = 0;
            for (i=0;i<l;i++){
              var station = new Station({id:codes[i]});
              station.url = sf.plugins.wunderground.stationUrl(codes[i]);
              station.fetch({
                // dataType: 'jsonp',
                dataType: 'json',
                success: function(response){
                  s.push(response.toJSON());
                  // if we've got all the stations back, create the collection
                  if(s.length === l) {
                    var stations = new Stations(s);
                  }
                }
              });
              // finally, create a view for this station
              var stationView = new StationView({model:station});
            }
          }
        });        

      }); // end document ready
      
    </script>

  </body>
</html>