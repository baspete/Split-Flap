// Home Sweet Global Namespace
var sf = {};

// Namespace for objects defined and used locally in templates
sf.local = {};

// ############################################################################
// HOUSEKEEPING

// Augment prototype with a "method" method
Function.prototype.method = function (name,func) {
  if(!this.prototype[name]) {
    this.prototype[name] = func;
    return this;
  }
};

// Augment String to remove spaces from the ends
String.method('trim', function() {
  return this.replace(/^\s+|\s+$/g, '');
});

// Methods for getting query parameters out of the URL
$.extend({
  getUrlParams: function(){
    var vars = [], param;
    var params = window.location.href.slice(window.location.href.indexOf('?') + 1, window.location.href.indexOf('#')).split('&');
    for(var i = 0; i < params.length; i++) {
      param = params[i].split('=');
      vars.push(param[0]);
      vars[param[0]] = param[1];
    }
    return vars;
  },
  getUrlParam: function(name){
    return $.getUrlParams()[name];
  }
});

Array.prototype.rotate = (function() {
  var unshift = Array.prototype.unshift,
      splice = Array.prototype.splice;
  return function(count) {
    var len = this.length >>> 0,
        count = count >> 0;
    unshift.apply(this, splice.call(this, count % len, len));
    return this;
  };
})();      
      


// ############################################################################
// DATA VISUALIZATION
sf.chart = {
  
  init: function() {

    sf.chart.splitFlap.init();
        
  },
  
  dataUrl: function() {
    // Note: sf.chart.dataBaseUrl set up in template 
    var params = arguments[0];
    var chartStyle = arguments[1];
    var dataPath = "";
    if(
      chartStyle === "pie" ||
      chartStyle === "column" ||
      chartStyle === "splitflap" ||
      chartStyle === "bar"
      ) {
      dataPath = "json/category";
    } else {
      dataPath = "json/time_series";
    }
    return sf.chart.dataBaseUrl + dataPath + "/index.php?" + params;  // NOTE TEMPORARY CHANGE HERE
  },
  
  changeDateRange: function() {
    var container = arguments[0]; // expects the container object
    var startDate = arguments[1];
    var endDate   = arguments[2]; // optional, defaults to today
    // set the new date value in the chart's form
    if(endDate) {
      container.find("input[name=startDate]").val(startDate);
      container.find("input[name=endDate]").val(endDate);
    } else {
      container.find("input[name=lookBack]").val(startDate);
    }
    // get the new chart
    // @TODO: this should be reRender()
    sf.chart.render(container);
    // set the new prefs
    sf.chart.savePreferences(container);
  },
  
  savePreferences: function() {
    var container = arguments[0];
    var prefs = sf.preferences.extract(container);
    sf.preferences.save(prefs, container);
  },
  
  // #15396 - if we render all the charts at once, it'll clog the
  // javascript pipeline until all $.getJSON() have finished. Load them one
  // at a time to prevent that from happening.
  renderIndex: 0,
  renderNext: function() {
    var maxIndex = ($(".chartContainer").size() - 1);
    var container = $(".chartContainer:eq(" + sf.chart.renderIndex + ")");
    if( sf.chart.renderIndex <= maxIndex) {
      // sanity check: don't try and render a chart if there's no value for "type"
      if(container.find("input[name=type]").size() > 0) {
        sf.chart.render(container);
      }
    }
    sf.chart.renderIndex++;
  },
  
  render: function() {
    var container = arguments[0]; // expects the container object
    // default display sizes
    var w = "440";
    var h = "300";
    var timeFormat = "%b %d";
    var timeFormatType = "chartDate";
    // add the time to the date format if we're only showing a 24 hour range
    if($("#dateSliderValue").val() === "oneDay") {
      timeFormat = "%b %d<br/>%h:%M%p";
      timeFormatType = "chartDateTime";
    }
    if(container.hasClass("sparkline")) {
      w = "75";
      h = "18";
    } else if(container.hasClass("fullWidth")){
      w = "900";
    }
    var id = container.find(".chart").attr("id");
    var chartStyle = container.find("input[name=chartStyle]").val();
    // make an array containing the values we're going to ignore
    var ignores = [];
    container.find("input[name=ignore]").each(function() {
      ignores.push($(this).val());
    });
    var dataOptions = {
      "sort": container.find("input[name=sort]").val(),
      "truncate": container.find("input[name=truncate]").val(),
      "maxResults": container.find("input[name=maxResults]").val(),
      "ignore": ignores
    };
    var params = container.find(".chartPrefs input").serialize();
    var options = {};
    if(chartStyle !== "splitflap"){
      $("#"+id).empty();
    }
    
    // ##################################################################################
    // SPARKLINES
    if(container.hasClass("sparkline")) {
      options = {
        type:chartStyle
      };
      $.getJSON(
        sf.chart.dataUrl(params, chartStyle),
        function(data) {
          var isEmpty = function(obj) {
            for(var i in obj){ 
              if(obj.hasOwnProperty(i)){
                return false;
              }
            }
            return true;
          };
          // disable sparklines for slider "all" on any listing page, 
          // enable on any detail page
          if($(".dateSliderValue").val() === "all" && $(".itemDetail").size() === 0) {
            $("#"+id).html("<div class='empty'>Trend&nbsp;Not<br/>&nbsp;Available</div>");
          // show "no data" if the dataset is empty
          } else if (typeof(data[0]) === 'undefined' || isEmpty(data[0].data)) {
            $("#"+id).html("<div class='empty'>No Data</div>");
          } else {
            $("#"+id).sparkline(sf.chart.formatData(data, "sparkline"), options);
          }
          sf.chart.renderNext();
        }
      );

    // ##################################################################################
    // FULL SIZED CHARTS
    } else {
      if(chartStyle === "pie") {
        // mini pie charts get no labels
        if(container.hasClass("sparkpie")) {
          options = {
            series: {
              pie: { 
                show: true,
                radius: 0.9,
                startAngle: 3/2,
                offset: {
                  top: 0,
                  left: 60
                }
              }
            },
            legend: {
              show: true,
              position: "nw",
              backgroundOpacity: 0
            }
          };
        } else {
          options = {
            series: {
              pie: { 
                show: true,
                label: {
                  show: "auto"
                },
                startAngle: 3/2
              }
            },
            legend: {
              show: false
            }
          };
        }
      } else {
        options = {
          xaxis: { 
            mode: "time",
            timeformat: timeFormat,
            label: "Time",
            twelveHourClock: true,
            tickLength: 0,
            tickFormatter: function(t) {
              var dStr = sf.date.format(new Date(t), timeFormatType);
              return dStr;
            }
          },
          yaxis: {
            min: 0 // should be all positive values for time series
          },
          series: {
            lines: { show: true },
            points: { show: true }
          },
          grid: {
            hoverable: true,
            borderWidth: 1,
            borderColor: "#CCC",
            autoHighlight: true
          },
          legend: {
            show: true,
            noColumns: 3,
            container: "#" + id + "_legend" // only shows up if we have one of these
          }
        };
      }
      $.getJSON(
        sf.chart.dataUrl(params, chartStyle),
        function(data) {
          var formattedData;
          if(data.length > 0) {
              
            // PIE CHART (flot)
            if(chartStyle === "pie") {
              // pie charts use the jquery.flot.pie.js plugin
              formattedData = sf.chart.formatData(data, "category", dataOptions);
              if(formattedData.length > 0) {
                $.plot($("#"+id), formattedData, options);
              } else {
                // sf.chart.formatData has returned an empty set, 
                // because all the values were zero. Let's indicate that.
                $("#"+id).html("<div class='empty'>No Activity</div>");
              }
            }
            
            // BAR CHART (sf.chart.barChart)
            else if(chartStyle === "bar") {
              // bar charts don't use flot, they're pure html
              formattedData = sf.chart.formatData(data, "category", dataOptions);
              if(formattedData.length > 0) {
                sf.chart.barChart($("#"+id), formattedData, dataOptions);
              } else {
                // sf.chart.formatData has returned an empty set, 
                // because all the values were zero. Let's indicate that.
                $("#"+id).html("<div class='empty'>No Activity</div>");
              }
            }
            
            // SPLIT FLAP CHART (sf.chart.splitFlap)
            else if(chartStyle === "splitflap") {
              // split flaps don't use flot, they're pure html
              formattedData = sf.chart.formatData(data, "category", dataOptions);
              if(formattedData.length > 0) {
                sf.chart.splitFlap.loadJson(formattedData, $("#"+id));
              }
            }
            
            // MOVING COLUMN (sf.chart.movingColumn)
            else if(chartStyle === "movingcolumn") {
              // split flaps don't use flot, they're pure html
              formattedData = sf.chart.formatData(data, "time_series", dataOptions);
              if(formattedData.length > 0) {
                sf.chart.movingColumn.loadJson(formattedData, $("#"+id));
              }
            }
            
            // ALL OTHER CHARTS (flot)
            else {
             $.plot($("#"+id), sf.chart.formatData(data, "time_series"), options);
            }
          } 
          
          // OTHERWISE, NO DATA!
          else {
            $("#"+id).html("<div class='empty'>No Data</div>");
          }
          sf.chart.renderNext();
        }
      );
    }
  },
  
  barChart: function() {
    var target = arguments[0];
    var data = arguments[1];
    var options = arguments[2];
    var categories = [];
    var category, percent, ratio;
    var markup = "";
    var separator = " ";
    var index = 1;
    var highest = 0;
    var total = 0;
    // Clear out any old charts
    target.empty();
    // Loop through data to create the "categories" array and find the highest value
    // (so we can calculate individual percentages based on the highest value)
    for(category in data) {
      if(data.hasOwnProperty(category)) {
        // see if this is the highest value
        if(data[category].data > highest) {
          highest = data[category].data;
        }
        // add it to the total value
        total = total + data[category].data;
        categories[index] = {"label":data[category].label, "value":data[category].data};
        index++;
      }
    }
    // Create the actual markup for the chart, based on the "categories" array we just populated.
    markup += "<dl>";
      for(category in categories) {
        if(categories.hasOwnProperty(category)) {
          percent = parseInt((categories[category].value / total) * 100, 10);
          ratio = parseInt((categories[category].value / highest) * 100, 10);
          if(percent < 1) {
            percent = "<1";
          }
          markup += "<dt>" + categories[category].label + "</dt>";
          markup += "<dd class='series_0'><span style='width:" + percent + "%;'></span>" + categories[category].value + "</dd>";
        }
      }
      markup += "<div class='x-axis'>";
        markup += "<div class='ticks'><div class='first'></div><div></div><div></div><div></div></div><span class='percent'>percent</span>";
      markup += "</div>";
    markup += "</dl>";
    // add the names of any ignored categories
    if(options.ignore.length > 0) {
      markup += "<div class='notShowing'>Not showing:";
      for(var ignored in options.ignore) {
        if(options.ignore.hasOwnProperty(ignored)) {
          markup += separator + options.ignore[ignored];
          separator = ", ";
        }
      }
      markup += "</div>";
    }
    target.html(markup);
  },
  
  movingColumn: {
  
    init: function() {
    
    },
    
    loadJson: function() {
    
      // for each column element
    
    }
  
  },

  splitFlap: {
  
    init: function() {
      
      // for each character, construct a drum array and
      // attach that array to the element's .data() object
      // finally, set each character to a space.
      $(".splitflap span").each(function() {
        // note the constructor here; each element gets a new drum instance
        var drum = new sf.chart.splitFlap.Drum();
        $(this).data("order", drum.startPosition);
        // set them to spaces initially
        sf.chart.splitFlap.change($(this), " ");
      });
    
    },
  
    Drum: function() {
      this.startPosition = [' ','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','.',',','?','!','/','\'','+','-','↑','↓'];
    },
    
    loadJson: function() {
      var input = arguments[0],
          container = arguments[1],
          rows = container.find(".row"),
          i;
      for(i=0;i<rows.length;i++) {
        if(input[i]) {
          sf.chart.splitFlap.loadRow(input[i],$(rows[i]));
        }
      }
    },
    
    loadRow: function() {
      var input = arguments[0],
          row = arguments[1], // the row object
          j,group;
      // first, load the key into the .category group
      group = row.find(".category");
      sf.chart.splitFlap.loadGroup(input.label, group);
      // and put that value into that group's data store
      group.data("contents",input.label);
      // load the data array into the .data[x] groups
      for(j=0;j<input.data.length;j++) {
        group = row.find(".data" + j);
        if(group.length > 0) {
          sf.chart.splitFlap.loadGroup(input.data[j], group);
          // put that value into that group's data store
          group.data("contents",input.data[j]);
        }
      }
    
    },
    
    loadGroup: function() {
      // load a string into a group of display elements
      var input = arguments[0], // the input (which may be a string or a int)
          input = input + '', // force it into a string
          target = arguments[1], // the object
          elements = target.find(".character"),
          strLen = elements.size(),
          i, characters;
      // split flap displays are only uppercase
      input = input.toUpperCase();
      // get individual characters
      characters = input.split("");
      // pad the array with spaces (to clear any existing characters)
      for(i=0;i<strLen;i++) {
        if(typeof(characters[i]) === 'undefined') {
          characters[i] = " ";
        }
      }
      // trim the array to the number of display elements
      characters = characters.slice(0,strLen);
      // assign them to the display elements
      for(var i=0;i<characters.length;i++) {
        // TODO: is there a more efficient way to do this?
        sf.chart.splitFlap.change($(elements[i]).find("span"), characters[i]);
      }
    },
    
    change: function() {
      var container = arguments[0],
          c = arguments[1], // the new character
          index, i, j;
      // get the curent order of the display element's drum
      var values = container.data("order");
      // how many times do we need to increment the drum?
      index = values.indexOf(c);
      // increment the drum
      for(i=0;i<index;i++) {
        sf.chart.splitFlap.show(container, (values[i + 1]));
      }
      // rotate the dom element's stored array to the new order for next time
      container.data("order", values.rotate(index));
      // change the number in the markup
      // container.text(c);
    },
    
    show: function() {
      var container = arguments[0],
          i = arguments[1],
          c = "c" + (i);
          // punctuation has special class names
          switch(i) {
            case " ": c = "csp"; break;
            case ".": c = "cper"; break;
            case ",": c = "ccom"; break;
            case "?": c = "cque"; break;
            case "!": c = "cexc"; break;
            case "/": c = "csla"; break;
            case "'": c = "capo"; break;
            case "+": c = "cplu"; break;
            case "-": c = "cmin"; break;
            case "↑": c = "cup"; break;
            case "↓": c = "cdn"; break;
          }
      container.fadeOut(50, function(){
        container.removeClass().addClass(c);
      }).fadeIn(50);
    }
  
  },

  formatData: function() {
    var input = arguments[0];
    var format = arguments[1];
    var options = arguments[2];
    var i,j,k,series,index,value;
    var output = [];
    var truncatedOutput = [];
    switch(format) {
      
      case "sparkline": 
        // We want a simple array of values, so we'll just start with 
        // time series data and extract the values
        series = sf.chart.formatData(input, "time_series")[0].data; // we're only expecting one series
        
        // Smaller series need to be padded with intermediate
        // values so they have adequate display width. We do this
        // by interpolating intermediate display points between data points
        if (series.length < 60) {
        
          for(i=0;i<series.length;i++) {

            value = series[i][1]; // the value is the second item in the array
            var pValue, // the previous value
                sValue, // the amount the value changes each step
                iValue, // the new interpolated value for each step
                quotient = Math.floor(30/series.length);

            // calculate the increment by which each point changes
            sValue = (value - pValue)/quotient;

            for (k=1; k <= quotient; k++) {
              // we need a pValue to calculate sValue, so don't
              // plot anything the first time through.
              if(typeof(pValue) !== "undefined") {
                // the value of the data point
                iValue = parseInt(pValue + (k * sValue),10);
                output.push(iValue);
              }
            }
            pValue = value;
          }
        }

        else {
          for(i=0;i<series.length;i++) {
            if ((i % 2) === 0) {
              value = series[i][1];
              output.push(value);
            }
          }
        }

      break;
      
      case "category":
        // The "data" node in this map uses category names as keys. Because there 
        // is no impled order in this data structure, we need to output array of 
        // the following format, thus:
        // Input:  data: {
        //                 "category1":[value1,value2,value3], 
        //                 "category2":[value4,value5,value6], 
        //                 "category3":[value7,value8,value9]
        //               }
        // Output: [
        //           {"label":"category1","data":[value1,value2,value3]},
        //           {"label":"category2","data":[value4,value5,value6]},
        //           {"label":"category3","data":[value7,value8,value9]}
        //         ]
        //
        // NOTE: Only non-zero values are included (so a set of all zero values will return
        //       an empty array.
        // NOTE: 'asc' and 'desc' sort based on the first value in the data array
        i = 0;
        var other = [];
        series = input[0].data;
        // first pass: create new data structure
        for(index in series) {
          if(series.hasOwnProperty(index)) {
            // add this category to the output (unless its in the "ignore" array)
            if(jQuery.inArray(index, options.ignore) === -1) {
              var data = series[index];
              output.push( {"label" : index, "data" : data } );
              i++;
            }
          }
        }
        // pick up any sorting options
        if(options.sort === "desc") {
          output.sort(function(a,b){
            return a.data[0]>b.data[0]?-1:1;
          });
        } else if(options.sort === "asc") {
          output.sort(function(a,b){
            return a.data[0]>b.data[0]?1:-1;
          });
        }
        // second pass: truncate/maxResults
        for(i=0;i < output.length; i++){
          if(i < options.truncate) {
            truncatedOutput.push(output[i]);
          } else {
            for(j=0;j<output[i].data.length;j++){
              // 'other[]' will be empty on the first trip
              // through this loop, so give it
              // zero values out to output[i].data.length
              if(typeof(other[j]) === 'number') {
                other[j] += parseInt(output[i].data[j],10);
              } else {
                other[j] = 0;
              }
            }
          }
          // bail if we hit maxResults
          if(i === parseInt(options.maxResults,10)) {
            break;
          }
        }
        // populate "Other" node
        if(other.length > 0) {
          truncatedOutput.push( {"label" : "other", "data" : other, "color": "#EFEFEF" } );
        }
        output = truncatedOutput;
      break;
      
      case "time_series":
        // The "data" node in this map uses timestamps (integers) as keys. Because there 
        // is no impled order in this data structure, we need to turn that data node 
        // into an array sorted by the timestamps, thus:
        // Input:  data: {time1:[value1], time2:[value2], time3:[value3]}
        // Output: data: [[time1,[value1]], [time2,[value2]], [time3,[value3]]]
        // 
        // NOTE: Input times are UTC, Output times are Local!
        //
        var offset = new Date().getTimezoneOffset() * 60 * 1000;
        for(i=0;i<input.length;i++) {
          output[i] = {
            id : input[i].id,
            label : input[i].label,
            type : input[i].type,
            data : []
          };
          series = input[i].data;
          j = 0;
          for(index in series) {
            if(series.hasOwnProperty(index)) {
              var localTime = index - offset;
              output[i].data[j] = [ localTime, series[index][0] ];
            }
            j++;
          }
          // sort the new data array by key (time, in this case)
          output[i].data.sort(function(a,b){
            return a[0]>b[0]?1:-1;
          });
        }
      break;
    }
    return output;
  },
  
  showTooltip: function (x, y, contents) {
    $('<div id="tooltip">' + contents + '</div>').css( {
      position: 'absolute',
      display: 'none',
      top: y - 45,
      left: x + 5,
      border: '1px solid #CCC',
      padding: '2px',
      'background-color': '#EFEFEF',
      opacity: 0.80
    }).appendTo("body").fadeIn(200);
  }
  
};


// ############################################################################
// DOCUMENT LOAD

$(document).ready(function() {

  sf.chart.init();

});

