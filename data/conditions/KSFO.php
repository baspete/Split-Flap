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
		"full":"San Francisco International, CA",
		"city":"San Francisco International",
		"state":"CA",
		"state_name":"California",
		"country":"US",
		"country_iso3166":"US",
		"zip":"94128",
		"latitude":"37.61888885",
		"longitude":"-122.37472534",
		"elevation":"3.00000000"
		},
		"observation_location": {
		"full":"San Francisco, California",
		"city":"San Francisco",
		"state":"California",
		"country":"US",
		"country_iso3166":"US",
		"latitude":"37.61999893",
		"longitude":"-122.37000275",
		"elevation":"10 ft"
		},
		"estimated": {
		},
		"station_id":"KSFO",
		"observation_time":"Last Updated on December 6, 4:56 PM PST",
		"observation_time_rfc822":"Tue, 06 Dec 2011 16:56:00 -0800",
		"observation_epoch":"1323219360",
		"local_time_rfc822":"Tue, 06 Dec 2011 17:31:57 -0800",
		"local_epoch":"1323221517",
		"local_tz_short":"PST",
		"local_tz_long":"America/Los_Angeles",
		"weather":"Mostly Cloudy",
		"temperature_string":"53 F (12 C)",
		"temp_f":<?php echo rand(30,90) ?>,
		"temp_c":12,
		"relative_humidity":"61%",
		"wind_string":"Calm",
		"wind_dir":"North",
		"wind_degrees":0,
		"wind_mph":<?php echo rand(0,40) ?>,
		"wind_gust_mph":0,
		"pressure_mb":"1027",
		"pressure_in":"30.33",
		"pressure_trend":"0",
		"dewpoint_string":"40 F (4 C)",
		"dewpoint_f":40,
		"dewpoint_c":4,
		"heat_index_string":"NA",
		"heat_index_f":"NA",
		"heat_index_c":"NA",
		"windchill_string":"NA",
		"windchill_f":"NA",
		"windchill_c":"NA",
		"visibility_mi":"9.0",
		"visibility_km":"14.5",
		"precip_1hr_string":"-9999.00 in (-9999.00 mm)",
		"precip_1hr_in":"-9999.00",
		"precip_1hr_metric":"-9999.00",
		"precip_today_string":"0.00 in (0.0 mm)",
		"precip_today_in":"0.00",
		"precip_today_metric":"0.0",
		"icon":"mostlycloudy",
		"icon_url":"http://icons-ak.wxug.com/i/c/k/nt_mostlycloudy.gif",
		"forecast_url":"http://www.wunderground.com/US/CA/San_Francisco_International.html",
		"history_url":"http://www.wunderground.com/history/airport/KSFO/2011/12/6/DailyHistory.html",
		"ob_url":"http://www.wunderground.com/cgi-bin/findweather/getForecast?query=37.61999893,-122.37000275"
	}
}
