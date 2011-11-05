<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
?>
// Activity tracker JSON example.
[
  {
   "type" : "site_activity",
   "label" : "Site Activity",
   "data" : {
     "www.basdesign.com" : [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1202],
     "sweetmidget.com" :   [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1105],
     "svnanaimo.com" :     [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1248],
     "dev.basdesign.com" : [<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1203],
     "pete.basdesign.com" :[<?php echo rand(0,2000) ?>, <?php echo rand(0,2000) ?>, 1147]
   },
   "key" : {
     "url" : ["last hour", "24hr avg", "last update time"]
   }
  }
]