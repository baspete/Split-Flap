<?php
// Don't cache this
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past

?>
{
	"response": {
		"version": "0.1"
		,"termsofService": "http://www.wunderground.com/weather/api/d/terms.html"
		,"features": {
		"conditions": 1
		}
	}
		,	"current_observation": {
		"image": {
		"url":"http://icons-ak.wxug.com/graphics/wu2/logo_130x80.png",
		"title":"Weather Underground",
		"link":"http://www.wunderground.com"
		},
		"display_location": {
		"full":"San Carlos, CA",
		"city":"San Carlos",
		"state":"CA",
		"state_name":"California",
		"country":"US",
		"country_iso3166":"US",
		"zip":"94065",
		"latitude":"37.51166534",
		"longitude":"-122.24944305",
		"elevation":"1.00000000"
		},
		"observation_location": {
		"full":"San Carlos, California",
		"city":"San Carlos",
		"state":"California",
		"country":"US",
		"country_iso3166":"US",
		"latitude":"37.50999832",
		"longitude":"-122.25000000",
		"elevation":"3 ft"
		},
		"estimated": {
		},
		"station_id":"KSQL",
		"observation_time":"Last Updated on December 6, 4:47 PM PST",
		"observation_time_rfc822":"Tue, 06 Dec 2011 16:47:00 -0800",
		"observation_epoch":"1323218820",
		"local_time_rfc822":"Tue, 06 Dec 2011 17:31:57 -0800",
		"local_epoch":"1323221517",
		"local_tz_short":"PST",
		"local_tz_long":"America/Los_Angeles",
		"weather":"Scattered Clouds",
		"temperature_string":"54 F (12 C)",
		"temp_f":<?php echo rand(30,90) ?>,
		"temp_c":12,
		"relative_humidity":"51%",
		"wind_string":"From the NW at 6 MPH",
		"wind_dir":"NW",
		"wind_degrees":320,
		"wind_mph":<?php echo rand(0,40) ?>,
		"wind_gust_mph":0,
		"pressure_mb":"1027",
		"pressure_in":"30.32",
		"pressure_trend":"-",
		"dewpoint_string":"36 F (2 C)",
		"dewpoint_f":36,
		"dewpoint_c":2,
		"heat_index_string":"NA",
		"heat_index_f":"NA",
		"heat_index_c":"NA",
		"windchill_string":"NA",
		"windchill_f":"NA",
		"windchill_c":"NA",
		"visibility_mi":"10.0",
		"visibility_km":"16.1",
		"precip_1hr_string":"-9999.00 in (-9999.00 mm)",
		"precip_1hr_in":"-9999.00",
		"precip_1hr_metric":"-9999.00",
		"precip_today_string":"0.00 in (0.0 mm)",
		"precip_today_in":"0.00",
		"precip_today_metric":"0.0",
		"icon":"partlycloudy",
		"icon_url":"http://icons-ak.wxug.com/i/c/k/nt_partlycloudy.gif",
		"forecast_url":"http://www.wunderground.com/US/CA/San_Carlos.html",
		"history_url":"http://www.wunderground.com/history/airport/KSQL/2011/12/6/DailyHistory.html",
		"ob_url":"http://www.wunderground.com/cgi-bin/findweather/getForecast?query=37.50999832,-122.25000000"
	}
}
