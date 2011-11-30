<?php
// This function returns a fake dataset based on the "data" query parameter in the format:
// {
//   "response": { 
//     "results": [ 
//       { 
//         "source" : "arrivals",
//         "key" : ["scheduled", "city", "airline", "gate", "status", "remarks"],
//         "data" : { 
//           "101" : ["0728", "London", "0", "C21", "1", "est 2130+"], 
//           "96"  : ["0952", "Madrid", "1", "A7", "0", ""]
//         }
//       } 
//     ] 
//   }
// }

// Don't cache this
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past

function randomTime(){
  $h = sprintf("%02d", rand(0,23));
  $m = sprintf("%02d", rand(0,59));
  return $h . $m;
};

$arrivals = array(
  "source" => "arrivals",
  "key" => array(
    "flight" => array("scheduled", "city", "airline", "gate", "status", "remarks")
  ),
  "data" => array( 
    " 101" => array(randomTime(),"Atlanta",rand(0,9),"C21","1","est 2130+"),
    "  96" => array(randomTime(),"Baltimore",rand(0,9),"A7","0",""),
    "7420" => array(randomTime(),"Charleston",rand(0,9),"A18","0",""),
    "   1" => array(randomTime(),"Durban",rand(0,9),"D44","1","cancelled"),
    "  99" => array(randomTime(),"Edinburgh",rand(0,9),"A12","0",""),
    " 215" => array(randomTime(),"Frankfurt",rand(0,9),"B2","0",""),
    " 174" => array(randomTime(),"Galveston",rand(0,9),"B14","0",""),
    "  41" => array(randomTime(),"Houston",rand(0,9),"C6","0",""),
    "4476" => array(randomTime(),"Indianapolis",rand(0,9),"D16","0",""),
    " 112" => array(randomTime(),"Jakarta",rand(0,9),"A6","0",""),
    "2145" => array(randomTime(),"Karachi",rand(0,9),"C7","0",""),
    "7772" => array(randomTime(),"Los Angeles",rand(0,9),"B12","0","")
  )
);

$departures = array(
  "source" => "departures",
  "key" => array(
    "flight" => array("scheduled", "city", "airline", "gate", "status", "remarks")
  ),
  "data" => array( 
    " 101" => array(randomTime(),"Ouagadougou",rand(0,9),"C21","1","est 2130+"),
    "  96" => array(randomTime(),"Panama City",rand(0,9),"A7","0",""),
    "7420" => array(randomTime(),"Quanduc",rand(0,9),"A18","0",""),
    "   1" => array(randomTime(),"Rotterdam",rand(0,9),"D44","1","cancelled"),
    "  99" => array(randomTime(),"Seoul",rand(0,9),"A12","0",""),
    " 215" => array(randomTime(),"Tashkent",rand(0,9),"B2","0",""),
    " 174" => array(randomTime(),"Ulaanbaatar",rand(0,9),"B14","0",""),
    "  41" => array(randomTime(),"Valparaiso",rand(0,9),"C6","0",""),
    "4476" => array(randomTime(),"Wagga Wagga",rand(0,9),"D16","0",""),
    " 112" => array(randomTime(),"Xuzhou",rand(0,9),"A6","0",""),
    "2145" => array(randomTime(),"Yakutsk",rand(0,9),"C7","0",""),
    "7772" => array(randomTime(),"Zagreb",rand(0,9),"B12","0","")
  )
);

$response = array(
  "response" => array(
    "results" => array()
  )
);

if ($_GET["data"] == "arrivals") {
  $response["response"]["results"][0] = $arrivals;
} else {
  $response["response"]["results"][0] = $departures;
}

echo json_encode($response);

?>
