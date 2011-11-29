<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
?>
// Activity tracker JSON example.
/*
[
  {
   "type" : "site_activity",
   "label" : "Site Activity",
   "data" : {
     "www.basdesign.com" : [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1202],
     "sweetmidget.com" :   [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1105],
     "svnanaimo.com" :     [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1248],
     "dev.basdesign.com" : [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1203],
     "pete.basdesign.com" :[<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1147],
     "www.google.com" : [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1202],
     "fark.com" :   [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1105],
     "wikipedia.org" :     [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1248],
     "youtube.com" : [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1203],
     "vimeo.com" :[<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1147],
     "amazon.com" : [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1202],
     "twitter.com" :   [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1105]
   },
   "key" : {
     "url" : ["last hour", "24hr avg", "last update time"]
   }
  }
]
*/

// Airport Solari Board Example.
[
  {
   "type" : "departures",
   "label" : "Departures",
   "data" : {
     " 101" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "London", "0", "C21", "1244", ""],
     "  96" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Madrid", "1", "A7", "1244", ""],
     "7420" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Belgrade", "2", "A18", "1244", ""],
     "   7" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Moscow", "3", "D44", "1244", ""],
     "  99" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "London", "4", "A12", "1244", ""],
     " 215" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Geneve", "5", "B2", "1244", ""],
     " 174" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Athens", "6", "B14", "1244", ""],
     "  41" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Munich", "7", "C6", "1244", ""],
     "4476" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Dubai", "8", "D16", "1244", ""],
     " 112" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Madrid", "8", "A6", "1244", ""],
     "2145" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "New York", "9", "C7", "1244", ""],
     "7772" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Los Angeles", "3", "B12", "1244", ""],
   },
   "key" : {
     "flight" : ["scheduled", "city", "airline", "gate", "actual", "remarks"]
   }
  }
]