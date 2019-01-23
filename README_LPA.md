# Split-flap Simulator for LPA Lighting

This branch differs from the master branch in a few significant ways:

1. app.js - The `cities` array is now structured so that each city has an array of airlines which service it. I have no idea what this should be for your cities, so you should edit this array for accuracy.

2. app.js - In the `cities` array the Durham and New York entries contain an `isBoarding` attribute. This attribute will trigger a "Boarding Now" remark, show the green light, and have a departure time randomly chosen from 10-30 minutes from now. You can add this attribute to any other cities in the future.

## Customization

If you want to display more rows on the screen, change the `numRows` attribute in public/index.html.

If you want to show more data, increase the number of items in the `cities` array in app.js. If this number is larger than the `numRows` value in public/index.html the display will paginate the results--up to the `maxResults` value set in public/index.html.

If you want to change the number of characters on each row, edit the "ROW TEMPLATE" section of public/index.html, adding or removing characters as needed. You'll probably also want to change the inline CSS `width` attributes up in the "CONTAINER" part of the same file. You may also want to change the width setting of the `splitflap` CSS class in public/plugins/flights/custom.css.

## Questions

Pete Butler - pbutler@basdesign.com
