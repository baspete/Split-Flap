// These are the airlines whose logos appear in this order on the image drum sprite
sf.display.ImageDrum = function() {
  return [
    ' ',
    'SWA',
    'AAL',
    'BAW',
    'DAL',
    'UAE',
    'KLM',
    'DLH',
    'ASA',
    'UAL',
    'FDX',
    'PXM',
    'SKW',
    'JBU',
    'ACA',
    'QXE',
    'NKS',
    'VIR',
    'LXJ',
    'QFA'
  ];
};

sf.plugins.flights = {
  dataType: 'json',

  // Here's where we get the data to render
  url: function(options) {
    return 'api/flights';
  },

  // If you need to do any data formatting before sending it
  // to the display you can do that in this function.
  formatData: function(response) {
    return response.data;
  }
};
