<?php
// This function returns a fake dataset based on the "data" query parameter in the format:
// {
//   "response": { 
//     "results": [ 
//       { 
//         "source" : "arrivals",
//         "data" : { 
//           "101" : {"scheduled":"0728", "city":"London", "airline":"0", "gate":"C21", "status":"1", "remarks":"est 2130+"}
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
  "data" => array( 
    " 101" => array("scheduled"=>randomTime(),"city"=>"Atlanta","airline"=>rand(0,9),"gate"=>"C21","status"=>"1","remarks"=>"10m early"),
    "  96" => array("scheduled"=>randomTime(),"city"=>"Baltimore","airline"=>rand(0,9),"gate"=>"A7","status"=>"0","remarks"=>""),
    "7420" => array("scheduled"=>randomTime(),"city"=>"Charleston","airline"=>rand(0,9),"gate"=>"A18","status"=>"0","remarks"=>""),
    "   1" => array("scheduled"=>randomTime(),"city"=>"Durban","airline"=>rand(0,9),"gate"=>"D44","status"=>"1","remarks"=>"delayed"),
    "  99" => array("scheduled"=>randomTime(),"city"=>"Edinburgh","airline"=>rand(0,9),"gate"=>"A12","status"=>"0","remarks"=>""),
    " 215" => array("scheduled"=>randomTime(),"city"=>"Frankfurt","airline"=>rand(0,9),"gate"=>"B2","status"=>"0","remarks"=>""),
    " 174" => array("scheduled"=>randomTime(),"city"=>"Galveston","airline"=>rand(0,9),"gate"=>"B14","status"=>"0","remarks"=>""),
    "  41" => array("scheduled"=>randomTime(),"city"=>"Houston","airline"=>rand(0,9),"gate"=>"C6","status"=>"0","remarks"=>""),
    "4476" => array("scheduled"=>randomTime(),"city"=>"Indianapolis","airline"=>rand(0,9),"gate"=>"D16","status"=>"0","remarks"=>""),
    " 112" => array("scheduled"=>randomTime(),"city"=>"Jakarta","airline"=>rand(0,9),"gate"=>"A6","status"=>"0","remarks"=>""),
    "2145" => array("scheduled"=>randomTime(),"city"=>"Karachi","airline"=>rand(0,9),"gate"=>"C7","status"=>"0","remarks"=>""),
    "7772" => array("scheduled"=>randomTime(),"city"=>"Los Angeles","airline"=>rand(0,9),"gate"=>"B12","status"=>"0","remarks"=>"")
  )
);

$departures = array(
  "source" => "departures",
  "data" => array( 
    " 101" => array("scheduled"=>randomTime(),"city"=>"Ouagadougou","airline"=>rand(0,9),"gate"=>"C21","status"=>"1","est 2130+"),
    "  96" => array("scheduled"=>randomTime(),"city"=>"Panama City","airline"=>rand(0,9),"gate"=>"A7","status"=>"0","remarks"=>""),
    "7420" => array("scheduled"=>randomTime(),"city"=>"Quanduc","airline"=>rand(0,9),"gate"=>"A18","status"=>"0","remarks"=>""),
    "   1" => array("scheduled"=>randomTime(),"city"=>"Rotterdam","airline"=>rand(0,9),"gate"=>"D44","status"=>"1","cancelled"),
    "  99" => array("scheduled"=>randomTime(),"city"=>"Seoul","airline"=>rand(0,9),"gate"=>"A12","status"=>"0","remarks"=>""),
    " 215" => array("scheduled"=>randomTime(),"city"=>"Tashkent","airline"=>rand(0,9),"gate"=>"B2","status"=>"0","remarks"=>""),
    " 174" => array("scheduled"=>randomTime(),"city"=>"Ulaanbaatar","airline"=>rand(0,9),"gate"=>"B14","status"=>"1","remarks"=>"weather"),
    "  41" => array("scheduled"=>randomTime(),"city"=>"Valparaiso","airline"=>rand(0,9),"gate"=>"C6","status"=>"0","remarks"=>""),
    "4476" => array("scheduled"=>randomTime(),"city"=>"Wagga Wagga","airline"=>rand(0,9),"gate"=>"D16","status"=>"0","remarks"=>""),
    " 112" => array("scheduled"=>randomTime(),"city"=>"Xuzhou","airline"=>rand(0,9),"gate"=>"A6","status"=>"0","remarks"=>""),
    "2145" => array("scheduled"=>randomTime(),"city"=>"Yakutsk","airline"=>rand(0,9),"gate"=>"C7","status"=>"0","remarks"=>""),
    "7772" => array("scheduled"=>randomTime(),"city"=>"Zagreb","airline"=>rand(0,9),"gate"=>"B12","status"=>"0","remarks"=>"")
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
