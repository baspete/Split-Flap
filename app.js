/* global require console process Promise module */

const express = require('express'),
  app = express();

const aircraftTypes = [
  'A320',
  'B738',
  'A321',
  'B77W',
  'B737',
  'A319',
  'A333',
  'B739',
  'A332',
  'B789',
  'B788',
  'CRJ2',
  'DH8D',
  'C172'
];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getTail() {
  let c = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ];
  return `N${getRandomInt(9999)}${c[getRandomInt(c.length - 1)]}`;
}

function getAirline() {
  const airlines = [
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
  return airlines[getRandomInt(airlines.length - 1)];
}

function getTime() {
  return '01:23';
}

function getFlight() {
  return getRandomInt(2000);
}

function getType() {
  return aircraftTypes[getRandomInt(aircraftTypes.length - 1)];
}

function getHeading() {
  return getRandomInt(359)
    .toString()
    .padStart(3, '0');
}

function getGate() {
  const t = ['A', 'B', 'C'][getRandomInt(2)];
  const g = getRandomInt(30);
  return `${t}${g}`;
}

function getCity() {
  const cities = [
    'Atlanta',
    'Baltimore',
    'Charleston',
    'Durban',
    'Edinburgh',
    'Frankfurt',
    'Galveston',
    'Havana',
    'Iowa City',
    'Jakarta',
    'Karachi',
    'Los Angeles',
    'Mexico City',
    'Nairobi',
    'Ontario',
    'Pittsburgh',
    'Quebec City',
    'Roanoake',
    'San Diego',
    'Tallahassee'
  ];
  return cities[getRandomInt(20)];
}

function getTime() {
  let hrs = getRandomInt(23)
    .toString()
    .padStart(2, '0');
  let mins = getRandomInt(59)
    .toString()
    .padStart(2, '0');
  return `${hrs}${mins}`;
}

function getRemarks() {
  return `${
    aircraftTypes[getRandomInt(aircraftTypes.length - 1)]
  } ${getCity()}`;
}

function getAltChange() {
  return [-1, 1, 0, 0, 0][getRandomInt(5)];
}

// ========================================================================
// API

app.use('/api/adsb', (req, res) => {
  let r = {
    data: []
  };

  for (let i = 0; i < 18; i++) {
    const isAirline = getRandomInt(10) > 3 ? true : false;
    const airline = isAirline ? getAirline() : '';
    const flight = isAirline ? getFlight() : getTail();
    const remarks = isAirline ? getRemarks() : '';
    r.data.push({
      airline,
      flight,
      type: getType(),
      distance: getRandomInt(500) / 10,
      altitude: getRandomInt(35000),
      altChange: getAltChange(),
      airspeed: getRandomInt(480),
      bearing: getRandomInt(359),
      remarks
    });
  }
  res.json(r);
});

app.use('/api/arrivals', (req, res) => {
  let r = {
    data: []
  };

  for (let i = 0; i < 18; i++) {
    let msg = getRemarks();
    let status = getRandomInt(10) > 5 ? 1 : 0;
    r.data.push({
      airline: getAirline(),
      flight: getFlight(),
      city: getCity(),
      gate: getGate(),
      scheduled: getTime(),
      remarks: msg,
      status: status
    });
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
