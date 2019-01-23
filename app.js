/* global require console process Promise module */

const express = require('express'),
  moment = require('moment'),
  app = express();

// This array holds the city names for which you want to show "Now Boarding"
const hostCities = ['Durham', 'New York'];
// This array holds the list of all cities and the airlies which fly to them.
// Airlines available on the image sprite are:
// 'SWA','AAL','BAW','DAL','UAE','KLM','DLH','ASA','UAL','FDX',
// 'PXM','SKW','JBU','ACA','QXE','NKS','VIR','LXJ','QFA'
const cities = [
  { name: 'Durham', airlines: ['SWA', 'JBU', 'AAL', 'UAL'] },
  {
    name: 'New York',
    airlines: ['JBU', 'AAL', 'UAL', 'BAW', 'DAL', 'VIR']
  },
  { name: 'London', airlines: ['BAW', 'UAL', 'DAL', 'VIR'] },
  { name: 'Los Angeles', airlines: ['SWA', 'UAL', 'SKW', 'ASA', 'AAL'] },
  { name: 'Melbourne', airlines: ['QFA', 'UAL', 'AAL'] },
  { name: 'Shanghai', airlines: ['BAW', 'QXE', 'UAE'] },
  { name: 'Sydney', airlines: ['BAW', 'QFA', 'UAE'] },
  { name: 'Hong Kong', airlines: ['BAW', 'KLM', 'UAE'] },
  { name: 'Dubai', airlines: ['BAW', 'UAL', 'UAE'] },
  { name: 'Colombo', airlines: ['BAW', 'QFA', 'VIR'] },
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
  const t = ['A', 'B', 'C'][getRandomInt(2)];
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

app.use('/api/flights', (req, res) => {
  let r = {
    data: []
  };

  // Iterate through the cities array and add fake data for each one
  for (let i = 0; i < cities.length; i++) {
    let isHostCity = hostCities.indexOf(cities[i].name) > -1 ? true : false;

    // Add this flight
    let data = {
      city: cities[i].name,
      airline: cities[i].airlines[getRandomInt(cities[i].airlines.length)],
      flight: getFlight(),
      gate: getGate(),
      scheduled: isHostCity
        ? moment()
            .add(30, 'minutes')
            .format('HHmm')
        : getRandomTime(), // 30 minutes from now for host cities; random for others
      remarks: isHostCity ? 'Now Boarding' : '',
      status: isHostCity ? 'A' : null
    };

    // Let's add an occasional delayed flight.
    if (!isHostCity) {
      let status = getRandomInt(10) === 1 ? 'B' : 'A'; // 10% of the time
      if (status === 'B') {
        data.status = status;
        data.remarks = `Delayed ${getRandomInt(40) + 10}M`;
      }
    }

    // Add the row the the response.
    r.data.push(data);
  }

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
