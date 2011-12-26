<html>
  <head>
    <link rel="stylesheet" href="css/base.css"/>
    <link rel="stylesheet" href="plugins/twitter/custom.css"/>
  </head>
  <body>
  

    <!-- ============================================ -->
    <!-- CHART CONTAINER                              -->
    <div id="display1" class="chartContainer splitflap">

      <!-- parameters -->
      <div class="chartPrefs" style="display:none;">
        <input type="hidden" name="id" value="<?php echo $_GET["id"] ?>" />    <!-- the type of data you want from the service -->
      </div>
      
      <ul id="chart1" class="chart">
        
        <h1>@<?php echo $_GET["id"] ?></h1>
  
        <!-- Header: 30px/char, 15px/separator, 120px/logo -->
        <div class="header" style="width:120px;margin-left:0px;">Time</div>
        <div class="header" style="width:120px;margin-left:0px;">Tweet</div>

        <!-- rows will be placed here dynamically from #row_template -->
        
      </ul>

    </div>
    <!-- END CHART CONTAINER                          -->
    <!-- ============================================ -->

    <script type="text/javascript" src="js/jquery-1.7.1-min.js"></script>
    <script type="text/javascript" src="js/underscore.js"></script>
    <script type="text/javascript" src="js/backbone.js"></script>
    <script type="text/javascript" src="js/split-flap.js"></script>
    <script type="text/javascript" src="plugins/twitter/custom.js"></script>

    <!-- ============================================ -->
    <!-- ROW TEMPLATE                                 -->
    <script type="text/template" id="row_template">
      <li class="row">
        <div class="group timestamp"> <!-- timestamp -->
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
        </div>
        <div class="group text"> <!-- tweet -->
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>

          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>

          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>
          <div class="full"><span></span></div>

          <div class="full"><span></span></div>
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
          this.el.find(".row").each(function(){
            sf.display.initRow($(this));
          })
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
      var Rows = Backbone.Collection.extend({
        update: function(container){
          this.fetch({
            success: function(response){
               sf.display.loadSequentially(response.toJSON(), container) // TODO: should this know about this method?
            }
          });
        },
        parse: function(json){
          return(sf.plugins.twitter.formatData(json)); // normalize this data 
        }
      });

      // Utility method to clear the board
      $("#clear").click(function(){
        sf.display.clear($('#display1'));
      });

      $(document).ready(function() {
        
        // Set the number of rows to create (defaults to 3).
        sf.local.numRows = 13;

        // generate the empty rows markup (a backbone View)
        var board = new Board;
        
        var container = $("#display1");
        var id = container.find("input[name=id]").val();

        var dataOptions = {
          "sort": container.find("input[name=sort]").val(),
          "order": container.find("input[name=order]").val()
        };
        
        // create the chart object (a backbone Collection)
        var tweets = new Rows;
        tweets.dataOptions = dataOptions;
        tweets.url = sf.plugins.twitter.url(id);
        tweets.sync = function(method, model, options){  
          options.timeout = 10000;  
          options.dataType = "jsonp";  
          return Backbone.sync(method, model, options);  
        };
        // update the chart (and set a refresh interval)
        tweets.update(container);
        setInterval(function(){
          tweets.update(container);
        }, 30000); // refresh interval

       });
      
    </script>

  </body>
</html>