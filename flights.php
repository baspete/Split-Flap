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
        <input type="hidden" name="data" value="<?php echo $_GET["data"] ?>" />    <!-- the type of data you want from the service -->
        <input type="hidden" name="sort" value="scheduled" />   <!-- the data group to sort from -->
        <input type="hidden" name="order" value="asc" />        <!-- sort order (default is ascending) -->
        <input type="hidden" name="maxResults" value="12" />    <!-- ignore results past this -->
      </div>
      
      <ul id="chart1" class="chart">
        
        <h1><?php echo $_GET["data"] ?></h1>
  
        <!-- Header: 30px/char, 15px/separator, 120px/logo -->
        <div class="header" style="width:120px;margin-left:0px;">Flight</div>
        <div class="header" style="width:120px;margin-left:30px;">Airline</div>
        <div class="header" style="width:360px;margin-left:30px;text-align:left;">City</div>
        <div class="header" style="width:90px;margin-left:30px;">Gate</div>
        <div class="header" style="width:135px;margin-left:30px;">Scheduled</div>
        <div class="header" style="width:270px;margin-left:30px;text-align:left;">Remarks</div>

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
        <div class="group label"> <!-- flight number -->
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
        </div>
        <div class="group airline"> <!-- airline -->
          <div class="logo"><span></span></div>
        </div>
        <div class="group city"> <!-- city -->
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
        <div class="group gate"> <!-- gate -->
          <div class="character"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
        </div>
        <div class="group scheduled"> <!-- scheduled -->
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="separator">:</div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
        </div>
        <div class="group remarks"> <!-- remarks -->
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
        </div>
        <div class="group status"> <!-- lights -->
          <div class="s0"></div>
          <div class="s1"></div>
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

      // This Collection is used to hold the datset for this board. 
      var Flights = Backbone.Collection.extend({
        update: function(container){
          this.fetch({
            success: function(response){
              sf.display.load(response.toJSON(), container) // TODO: should this know about this method?
            }
          });
        },
        parse: function(json){
          var formattedData = sf.plugins.airport.formatData(json); // normalize this data
          var sortedData = sf.data.sortData(formattedData, this.dataOptions); // sort the normalized data
          return(sortedData); 
        }
      });

      // Utility method to clear the board
      $("#clear").click(function(){
        sf.display.clear($('#display1'));
      });

      $(document).ready(function() {
        
        // Set the number of rows to create (defaults to 3).
        sf.local.numRows = 12;

        // generate the empty rows markup (a backbone View)
        var board = new Board;
        sf.display.init();
        
        // get the sort, etc. params
        var container = $("#display1");
        var params = container.find(".chartPrefs input");
        var dataOptions = {
          "sort": container.find("input[name=sort]").val(),
          "order": container.find("input[name=order]").val(),
          "truncate": container.find("input[name=truncate]").val(),
          "maxResults": container.find("input[name=maxResults]").val()
        };
        
        // create the chart object (a backbone Collection)
        var flights = new Flights;
        flights.dataOptions = dataOptions;
        flights.url = sf.plugins.airport.url(params);
        // update the chart (and set a refresh interval)
        flights.update(container);
        setInterval(function(){
          flights.update(container);
        }, 30000); // refresh inteval

       });
      
    </script>

  </body>
</html>