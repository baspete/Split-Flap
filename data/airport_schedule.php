<?php
// This function returns a fake dataset based on the "data" query parameter in the format:
// {
//   "response": { 
//     "results": [ 
//       { 
//         "source" : "arrivals",
//         "data" : [
//           {"flight:101", "scheduled":"0728", "city":"London", "airline":"0", "gate":"C21", "status":"1", "remarks":"est 2130+"}
//         ]
//       } 
//     ] 
//   }
// }

// Don't cache this
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past

function randomAirline(){
  $airlines = array("AFL","AAL","BAW","DAL","UAE","KLM","DLH","RYR","UAL","AWE");
  return $airlines[rand(0,9)];
};

function randomTime(){
  $h = sprintf("%02d", rand(0,23));
  $m = sprintf("%02d", rand(0,59));
  return $h . $m;
};

$arrivals = array(
  "source" => "arrivals",
  "data" => array( 
    0 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Atlanta","airline"=>randomAirline(),"gate"=>"C21","status"=>"1","remarks"=>"10m early"),
    1 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Baltimore","airline"=>randomAirline(),"gate"=>"A7","status"=>"0","remarks"=>""),
    2 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Charleston","airline"=>randomAirline(),"gate"=>"A18","status"=>"0","remarks"=>""),
    3 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Durban","airline"=>randomAirline(),"gate"=>"D44","status"=>"1","remarks"=>"delayed"),
    4 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Edinburgh","airline"=>randomAirline(),"gate"=>"A12","status"=>"0","remarks"=>""),
    5 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Frankfurt","airline"=>randomAirline(),"gate"=>"B2","status"=>"0","remarks"=>""),
    6 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Galveston","airline"=>randomAirline(),"gate"=>"B14","status"=>"0","remarks"=>""),
    7 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Houston","airline"=>randomAirline(),"gate"=>"C6","status"=>"0","remarks"=>""),
    8 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Indianapolis","airline"=>randomAirline(),"gate"=>"D16","status"=>"0","remarks"=>""),
    9 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Jakarta","airline"=>randomAirline(),"gate"=>"A6","status"=>"0","remarks"=>""),
    10 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Karachi","airline"=>randomAirline(),"gate"=>"C7","status"=>"0","remarks"=>""),
    11 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Los Angeles","airline"=>randomAirline(),"gate"=>"B12","status"=>"0","remarks"=>"")
  )
);

$departures = array(
  "source" => "departures",
  "data" => array( 
    0 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Ouagadougou","airline"=>randomAirline(),"gate"=>"C21","status"=>"1","est 2130+"),
    1 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Panama City","airline"=>randomAirline(),"gate"=>"A7","status"=>"0","remarks"=>""),
    2 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Quanduc","airline"=>randomAirline(),"gate"=>"A18","status"=>"0","remarks"=>""),
    3 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Rotterdam","airline"=>randomAirline(),"gate"=>"D44","status"=>"1","cancelled"),
    4 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Seoul","airline"=>randomAirline(),"gate"=>"A12","status"=>"0","remarks"=>""),
    5 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Tashkent","airline"=>randomAirline(),"gate"=>"B2","status"=>"0","remarks"=>""),
    6 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Ulaanbaatar","airline"=>randomAirline(),"gate"=>"B14","status"=>"1","remarks"=>"weather"),
    7 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Valparaiso","airline"=>randomAirline(),"gate"=>"C6","status"=>"0","remarks"=>""),
    8 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Wagga Wagga","airline"=>randomAirline(),"gate"=>"D16","status"=>"0","remarks"=>""),
    9 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Xuzhou","airline"=>randomAirline(),"gate"=>"A6","status"=>"0","remarks"=>""),
    10 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Yakutsk","airline"=>randomAirline(),"gate"=>"C7","status"=>"0","remarks"=>""),
    11 => array("flight"=>rand(1,2000),"scheduled"=>randomTime(),"city"=>"Zagreb","airline"=>randomAirline(),"gate"=>"B12","status"=>"0","remarks"=>"")
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
