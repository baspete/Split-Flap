/* global require console process Promise module */

const express = require('express'),
  app = express();

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomAirline() {
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

function getRandomTime() {
  return '01:23';
}

function getRandomFlight() {
  return getRandomInt(2000);
}

function getRandomGate() {
  const t = ['A', 'B', 'C'][getRandomInt(2)];
  const g = getRandomInt(30);
  return `${t}${g}`;
}

function getRandomCity() {
  const c = [
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
  return c[getRandomInt(6)];
}

function getRandomTime() {
  let hrs = getRandomInt(23).toString();
  let mins = getRandomInt(59).toString();
  for (let i = hrs.length; i < 2; i++) {
    hrs = '0' + hrs;
  }
  for (let i = mins.length; i < 2; i++) {
    mins = '0' + mins;
  }
  return `${hrs}${mins}`;
}

function getRandomMessage() {
  return "↑↓:@#,./'+-";
}

// ========================================================================
// API

app.use('/api/flights', (req, res) => {
  let r = {
    data: []
  };

  for (let i = 0; i < 18; i++) {
    let msg = getRandomMessage();
    let status = msg === 'delayed' ? 1 : 0;
    r.data.push({
      airline: getRandomAirline(),
      flight: getRandomFlight(),
      city: getRandomCity(),
      gate: getRandomGate(),
      scheduled: getRandomTime(),
      remarks: msg,
      status: status
    });
  }

  res.json(r);
});

// ========================================================================
// WEB APP
app.use('/', express.static('public'));

// ========================================================================
// WEB SERVER
const port = process.env.PORT || 8080;
app.listen(port);
console.log('split flap started on port ' + port);
