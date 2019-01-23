/* global require console process Promise module */

const express = require('express'),
  moment = require('moment'),
  app = express();

// This array holds the list of all cities and the airlies which fly to them.
// Airlines available on the image sprite are:
// 'SWA' - Southwest Airlines
// 'AAL' - American Airlines
// 'BAW' - British Airways
// 'DAL' - Delta airlines
// 'UAE' - Emirates
// 'KLM' - KLM
// 'DLH' - Lufthansa
// 'ASA' - Alaska Airlines
// 'UAL' - United Airlines
// 'FDX' - Fedex
// 'PXM' - Fedex
// 'SKW' - Skywest
// 'JBU' - Jet Blue
// 'ACA' - Air Canada
// 'QXE' - Horizon Airlines
// 'NKS' - Spirit Airlines
// 'VIR' - Virgin Atlantic
// 'LXJ' - FlexJet
// 'QFA' - Qantas
const cities = [
  { name: 'Durham', airlines: ['SWA', 'JBU', 'AAL', 'UAL'], isHost: true },
  {
    name: 'New York',
    airlines: ['JBU', 'AAL', 'UAL', 'BAW', 'DAL', 'VIR'],
    isHost: true
  },
  { name: 'London', airlines: ['BAW', 'UAL', 'DAL', 'VIR'] },
  { name: 'Los Angeles', airlines: ['SWA', 'UAL', 'SKW', 'ASA', 'AAL'] },
  { name: 'Melbourne', airlines: ['QFA', 'UAL', 'AAL'] },
  { name: 'Shanghai', airlines: ['BAW', 'QXE', 'UAE'] },
  { name: 'Sydney', airlines: ['BAW', 'QFA', 'UAE'] },
  { name: 'Hong Kong', airlines: ['BAW', 'KLM', 'UAE', 'DLH'] },
  { name: 'Dubai', airlines: ['BAW', 'UAL', 'UAE', 'KLM'] },
  { name: 'Colombo', airlines: ['BAW', 'QFA', 'VIR', 'KLM'] },
  { name: 'Buenos Aires', airlines: ['BAW', 'NKS', 'UAE'] },
  { name: 'Nanhai', airlines: ['BAW', 'ACA', 'UAE'] }
];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getTime() {
  return '01:23';
}

function getFlight() {
  return getRandomInt(2000);
}

function getHeading() {
  return getRandomInt(359)
    .toString()
    .padStart(3, '0');
}

function getGate() {
  const t = ['A', 'B', 'C'][getRandomInt(3)];
  const g = getRandomInt(29) + 1; // There's no gate zero
  return `${t}${g}`;
}

function getRandomTime() {
  let hrs = getRandomInt(23)
    .toString()
    .padStart(2, '0');
  let mins = getRandomInt(59)
    .toString()
    .padStart(2, '0');
  return `${hrs}${mins}`;
}

// ========================================================================
// API

// This Endpoint will return a list of flights corresponding to the
// list of cities in the 'cities' array above.
// The browser application will sort these as defined by the 'sort' and
// 'order' attributes in sf.options (defined in index.html).
app.use('/api/flights', (req, res) => {
  // This will hold the data this API returns
  let r = {
    data: []
  };

  // Iterate through the cities array and add fake data for each one
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    // Add this flight
    let data = {
      city: city.name,
      // Pick an airline randomly from this city's 'airlines' array
      airline: city.airlines[getRandomInt(city.airlines.length)],
      flight: getFlight(),
      gate: getGate(),
      // For host cities, the departure time will be a random number
      // from 10 to 30 minutes from now. For other cities it will be
      // a random time from 00:00 - 23:59.
      scheduled: city.isHost
        ? moment()
            .add(getRandomInt(20) + 10, 'minutes')
            .format('HHmm')
        : getRandomTime(),
      // Host cities are boarding now
      remarks: city.isHost ? 'Now Boarding' : '',
      status: city.isHost ? 'A' : null
    };

    // Let's add an occasional delayed flight for non-host cities 10% of the time.
    if (!city.isHost) {
      let status = getRandomInt(10) === 1 ? 'B' : 'A';
      if (status === 'B') {
        data.status = status;
        data.remarks = `Delayed ${getRandomInt(40) + 10}M`;
      }
    }

    // Add this flight to the response.
    r.data.push(data);
  }

  // OK, we're done. Return the response.
  res.json(r);
});

// ========================================================================
// STATIC FILES
app.use('/', express.static('public'));

// ========================================================================
// WEB SERVER
const port = process.env.PORT || 8080;
app.listen(port);
console.log('split flap started on port ' + port);
