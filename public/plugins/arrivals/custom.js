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

sf.plugins.arrivals = {
  dataType: 'json',

  // input: map of parameters
  // output: url
  url: function(options) {
    var base_url = 'api/arrivals';
    return base_url + '?data=' + options.data;
  },

  formatData: function(response) {
    return response.data;
  }
};