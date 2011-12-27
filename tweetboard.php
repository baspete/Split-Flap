<html>
  <head>
    <link rel="stylesheet" href="css/base.css"/>

  </head>
  <body>
  
    <!-- ============================================ -->
    <!-- CONTAINER                                    -->
    <div id="display1" class="chartContainer splitflap">

      <ul id="board">
        
        <h1><?php echo $_GET["q"] ?></h1>
  
        <!-- Header: 30px/char, 15px/separator, 120px/logo -->
        <div class="header" style="width:65px;margin-left:0px;"></div>
        <div class="header" style="width:120px;">Time</div>
        <div class="header" style="width:120px;">Tweet</div>

        <!-- rows will be placed here dynamically from #row_template -->
        
      </ul>

    </div>
    <!-- END CONTAINER                                -->
    <!-- ============================================ -->

    <!-- ============================================ -->
    <!-- ROW TEMPLATE                                 -->
    <script type="text/template" id="row_template">
      <li class="row">
        <div class="group status" style="margin-right:20px;"> <!-- lights -->
          <div class="s0"></div>
          <div class="s1"></div>
        </div>
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

    <!-- ============================================ -->
    <!-- JS LIBRARIES                                 -->
    <script type="text/javascript" src="js/jquery-1.7.1-min.js"></script>
    <script type="text/javascript" src="js/underscore.js"></script>
    <script type="text/javascript" src="js/backbone.js"></script>
    <script type="text/javascript" src="js/split-flap.js"></script>

    <!-- ============================================ -->
    <!-- CUSTOM CSS FOR THIS BOARD                    -->
    <link rel="stylesheet" href="plugins/twitter/custom1080.css"/>

    <!-- ============================================ -->
    <!-- CUSTOM JS FOR THIS BOARD                     -->
    <script type="text/javascript" src="plugins/twitter/custom.js"></script>
    <script type="text/javascript">

      $(document).ready(function() {
        
        // Set the number of rows to create (defaults to 3).
        sf.local.numRows = 14;

        // generate the empty rows markup (a backbone View)
        var board = new sf.Board;
        
        var container = $("#display1");
        var q = container.find("input[name=q]").val();

        var dataOptions = {
          "sort": container.find("input[name=sort]").val(),
          "order": container.find("input[name=order]").val()
        };
        
        // create the chart object (a backbone Collection)
        var tweets = new sf.Rows;
        tweets.dataOptions = dataOptions;
        tweets.url = sf.plugins.twitter.url();
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