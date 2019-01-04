# Virtual Split-Flap Display

This is a simulation of a split-flap display (often called a Solari board) designed to run in a web browser. It dynamically loads JSON data from a data source and renders that data as characters and images on the board. Individual characters are animated using CSS sprites.

The look and feel are fully configurable by changing the markup and using different sprite images, and the included files are simply examples intended to get you started with your own project.

There are two example client-side files in the /public directory, arrivals.html and adsb.html. Arrivals.html simulates a typical arrivals board, and adsb.html is designed to display information from an ADS-B running dump1080.

## Application Structure

`/public/js` - The client-side code is in `split-flap.js`. This code expects jquery, underscore and backbone to be available. Copies have been included for convenience.

`/public/img` - Image sprites. Customize these to change the look of the split flap elements or utilize different character sets.

`/public/css` - The base styles for this application. These can be extended or overridden by adding your own in `/public/plugins`.

`/public/adsb.html` & `public/arrivals.html` - Example HTML to render into the browser. Customize to your needs.

`/public/plugins` - Custom Javascript, CSS and images. Use these as a starting point to connect to new data sources, change the look and feel, etc.

`/app.js` - A simple Node.js application to serve static files (HTML, Javascript, CSS and images) and to serve JSON data to populate the displays. If you already have a web/application server you might not need this file.

## Installation

```
git clone https://github.com/baspete/Split-Flap.git
cd Split-Flap
npm install
node app.js
```

Navigate to `http://locahost:8080/arrivals.html` or `http://locahost:8080/adsb.html` in your browser.

## Customization

The look and feel is customized by changing the markup, CSS and sprite images. Of course, any size changes you make to the images must be reflected in the sprite images and vice-versa.

The display refresh interval and the data source url are set in the `<script>` block at the bottom of the HTML pages. Make sure this interval is set long enough so that the entire display has finished rendering before starting again.

The row refresh cascade interval is set in the setTimeout() function in sf.chart.render(). Setting this too low results in a jerky animation as too many elements animate at once and slow your processor.

The individual elements' animation speed is set in the fadeIn() and fadeOut() functions in sf.chart.splitFlap.show()

The sort criteria, and max number of results are set in the hidden `<input>` elements in arrivals.html

## Data

`app.js` exposes two API routes: `/api/arrivals` and `/api/adsb` which demonstrate sending data to `split-flap.js`. For example, the ADS-B service returns something like:

```
{
    "data":[
        {"airline":"BAW","flight":188,"type":"A320","distance":30.6,"altitude":32057,"altChange":0,"airspeed":252,"bearing":240,"remarks":"B77W Ontario"},
        {"airline":"","flight":"N4361r","type":"A332","distance":4.3,"altitude":12226,"altChange":-1,"airspeed":1,"bearing":92,"remarks":"KOAK"}
    ]
}
```

The files in `/public/plugins` are used to set the URL for the data and process the results. See `/public/plugins/adsb/custom.js` for an example.
