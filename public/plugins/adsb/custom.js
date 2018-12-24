sf.display.ImageDrum = function() {
  return [
    ' ',
    'AFL',
    'AAL',
    'BAW',
    'DAL',
    'UAE',
    'KLM',
    'DLH',
    'RYR',
    'UAL',
    'AWE'
  ];
};

sf.plugins.adsb = {
  dataType: 'json',

  url: options => {
    return `api/adsb?data=${options.data}`;
  },

  getLocationString: (distance, degrees) => {
    return `${sf.plugins.adsb.getDistanceString(
      distance
    )}${sf.plugins.adsb.getCompassPoints(degrees)}`;
  },

  getDistanceString: distance => {
    return (distance * 10)
      .toString()
      .padStart(2, '0')
      .padStart(3, ' ');
  },

  getCompassPoints: degrees => {
    if (typeof degrees !== 'number') {
      return degrees.toString();
    } else {
      if (degrees < 22.5) {
        return 'N';
      } else if (degrees < 67.5) {
        return 'NE';
      } else if (degrees < 112.5) {
        return 'E';
      } else if (degrees < 157.5) {
        return 'SE';
      } else if (degrees < 202.5) {
        return 'S';
      } else if (degrees < 247.5) {
        return 'SW';
      } else if (degrees < 292.5) {
        return 'W';
      } else if (degrees < 337.5) {
        return 'NW';
      } else if (degrees < 360.5) {
        return 'N';
      }
    }
  },

  getAltitudeChangeString: c => {
    if (c > 0) {
      return '↑';
    } else if (c < 0) {
      return '↓';
    } else {
      return '';
    }
  },

  formatData: response => {
    for (let i = 0; i < response.data.length; i++) {
      let aircraft = response.data[i];
      aircraft['location-str'] = sf.plugins.adsb.getLocationString(
        aircraft.distance,
        aircraft.bearing
      );
      aircraft['altitude-chg-str'] = sf.plugins.adsb.getAltitudeChangeString(
        aircraft.altChange
      );
      aircraft['altitude-str'] = aircraft.altitude.toString().padStart(5, ' ');
      aircraft['airspeed-str'] = aircraft.airspeed.toString().padStart(3, ' ');
    }
    return response.data;
  }
};
