<html>
  <head>
    <link rel="stylesheet" href="css/base.css"/>

    <!-- ============================================ -->
    <!-- CUSTOM CSS FOR THIS BOARD                    -->
    <link rel="stylesheet" href="plugins/airport/custom.css"/>

  </head>
  <body>
  
    <!-- ============================================ -->
    <!-- CONTAINER                                    -->
    <div id="board" class="chartContainer splitflap">

      <!-- parameters -->
      <input type="hidden" name="data" value="<?php echo $_GET["data"] ?>" />    <!-- the type of data you want from the service -->
      <input type="hidden" name="sort" value="<?php echo $_GET["sort"] ?>" />    <!-- the data group to sort by -->
      <input type="hidden" name="order" value="<?php echo $_GET["order"] ?>" />  <!-- sort order (default is ascending) -->
      
      <h1><?php echo $_GET["data"] ?></h1>

      <!-- Header: 30px/char, 15px/separator, 120px/logo -->
      <div class="header" style="width:120px;margin-left:0px;">Airline</div>
      <div class="header" style="width:120px;margin-left:30px;">Flight</div>
      <div class="header" style="width:360px;margin-left:30px;text-align:left;">City</div>
      <div class="header" style="width:90px;margin-left:30px;">Gate</div>
      <div class="header" style="width:135px;margin-left:30px;">Scheduled</div>
      <div class="header" style="width:270px;margin-left:30px;text-align:left;">Remarks</div>

      <!-- rows will be placed here dynamically from #row_template -->
        
    </div>
    <!-- END CONTAINER                                -->
    <!-- ============================================ -->

    <!-- ============================================ -->
    <!-- ROW TEMPLATE                                 -->
    <script type="text/template" id="row_template">
      <div class="row">
        <div class="group airline"> <!-- airline -->
          <div class="image"><span></span></div>
        </div>
        <div class="group flight"> <!-- flight number -->
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
          <div class="number"><span></span></div>
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
    <script type="text/javascript" src="plugins/airport/custom.js"></script>
    <script type="text/javascript">

      // CUSTOMIZATION OPTIONS
      sf.options = {
        // REQUIRED
        "plugin":          "airport",          // board type
        "container":       $("#board"),        // where to put the board
        "template":        $("#row_template"), // template markup
        "numRows":         12,                 // number of rows

        // OPTIONAL
        "maxResults":      12,                 // number of items to retrieve from service
        "data":            $("#board").find("input[name=data]").val(),   
        "sort":            $("#board").find("input[name=sort]").val(),  
        "order":           $("#board").find("input[name=order]").val(), 

        "refreshInterval": 30000,              // how often to refresh the display (ms)
        "stagger":         1500                // delay between loading rows (ms)
      };

      $(document).ready(function() {
        sf.board.init(sf.options);
        sf.items.init(sf.options);
       });
      
    </script>

  </body>
</html>