<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
?>
[
  {
   "type" : "departures",
   "label" : "Departures",
   "data" : {
     " 101" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "London", "0", "C21", "1", "est 2130+"],
     "  96" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Madrid", "1", "A7", "0", ""],
     "7420" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Belgrade", "2", "A18", "0", ""],
     "   7" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Moscow", "3", "D44", "0", ""],
     "  99" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "London", "4", "A12", "1", "cancelled"],
     " 215" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Geneve", "5", "B2", "0", ""],
     " 174" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Athens", "6", "B14", "0", ""],
     "  41" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Munich", "7", "C6", "0", ""],
     "4476" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Dubai", "8", "D16", "0", ""],
     " 112" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Madrid", "8", "A6", "0", ""],
     "2145" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "New York", "9", "C7", "0", ""],
     "7772" : ["<?php echo sprintf("%02d", rand(0,23)) ?><?php echo sprintf("%02d", rand(0,59)) ?>", "Los Angeles", "3", "B12", "0", ""]
   },
   "key" : {
     "flight" : ["scheduled", "city", "airline", "gate", "status", "remarks"]
   }
  }
]