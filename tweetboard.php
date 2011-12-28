<html>
  <head>
    <link rel="stylesheet" href="css/base.css"/>

    <!-- ============================================ -->
    <!-- CUSTOM CSS FOR THIS BOARD                    -->
    <link rel="stylesheet" href="plugins/twitter/custom1080.css"/>

  </head>
  <body>
  
    <!-- ============================================ -->
    <!-- CONTAINER                                    -->
    <div id="board" class="chartContainer splitflap">
      
      <h1><?php echo $_GET["q"] ?></h1>

      <!-- Header: 30px/char, 15px/separator, 120px/logo -->
      <div class="header" style="width:70px;margin-left:0px;">Today</div>
      <div class="header" style="width:120px;">Time</div>
      <div class="header" style="width:120px;">Tweet</div>

      <!-- rows will be appended here dynamically from #row_template -->

    </div>
    <!-- END CONTAINER                                -->
    <!-- ============================================ -->

    <!-- ============================================ -->
    <!-- ROW TEMPLATE                                 -->
    <script type="text/template" id="row_template">
      <div class="row">
        <div class="group status" style="margin-left:10px;margin-right:20px;"> <!-- lights -->
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
      </div>
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
    <!-- CUSTOM JS FOR THIS BOARD                     -->
    <script type="text/javascript" src="plugins/twitter/custom.js"></script>
    <script type="text/javascript">

      // CUSTOMIZATION OPTIONS
      sf.options = {
        // REQUIRED
        "plugin":          "twitter",          // board type
        "container":       $("#board"),        // where to put the board
        "template":        $("#row_template"), // template markup
        "numRows":         14,                 // number of rows

        // OPTIONAL
        "refreshInterval": 30000,              // how often to refresh the display (ms)
        "stagger":         1500                // delay between loading rows (ms)
      };

      // initialize the board
      $(document).ready(function() {
        sf.board.init(sf.options);
        sf.items.init(sf.options);
      });
      
    </script>

  </body>
</html>