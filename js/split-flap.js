// Home Sweet Global Namespace
var sf = {};

// Namespace for objects defined and used locally in templates
sf.local = {};

// ############################################################################
// HOUSEKEEPING

// Methods for getting query parameters out of the URL
$.extend({
  getUrlParams: function(){
    var vars = [], 
        params = window.location.href.slice(window.location.href.indexOf('?') + 1, window.location.href.indexOf('#')).split('&');
    for(var i = 0; i < params.length; i++) {
      var param = params[i].split('=');
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
  
  dataUrl: function() {
    // Note: sf.chart.dataBaseUrl set up in template 
    var params = arguments[0],
        chartStyle = arguments[1],
        dataPath = "json/category";
    return sf.chart.dataBaseUrl + dataPath + "/index.php?" + params;  // NOTE TEMPORARY CHANGE HERE
  },
  
  render: function() {
    var container = arguments[0]; // expects the container object
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

    $.getJSON(
      sf.chart.dataUrl(params, chartStyle),
      function(data) {
        var formattedData;
        if(data.length > 0) {
          formattedData = sf.chart.formatData(data, "category", dataOptions);
          if(formattedData.length > 0) {
            sf.chart.splitFlap.loadJson(formattedData, container);
          }  else {  // OTHERWISE, NO DATA!
            container.html("<div class='empty'>No Data</div>");
          }
        }
      }
    );

  },

  splitFlap: {
  
    init: function() {
      
      // for each character, construct a drum array and
      // attach that array to the element's .data() object
      // finally, set each character to a space.
      $(".splitflap span").each(function() {
        var parent = $(this).closest("div");
        if(parent.hasClass("number")){
          var drum = new sf.chart.splitFlap.NumDrum(); // Numbers only
        } else if(parent.hasClass("character")) {
          var drum = new sf.chart.splitFlap.CharDrum(); // Characters only
        } else {
          var drum = new sf.chart.splitFlap.FullDrum(); // The full set
        }
        $(this).data("order", drum.order);
        // set them to spaces initially
        sf.chart.splitFlap.change($(this), " ");
      });
    
    },
  
    FullDrum: function() {
      this.order = [' ','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','.',',','?','!','/','\'','+','-','↑','↓'];
    },
    CharDrum: function() {
      this.order = [' ','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','.',','];
    },
    NumDrum: function() {
      this.order = [' ','0','1','2','3','4','5','6','7','8','9','.',','];
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
          elements = target.find(".character, .number, .full, .logo"),
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
    var input = arguments[0],
        format = arguments[1],
        options = arguments[2],
        series = input[0].data,
        i=0, j=0, k=0, index=0, value=0,
        output = [],
        truncatedOutput = [],
        other = [];
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
      
    return truncatedOutput;
  }
  
};


// ############################################################################
// DOCUMENT LOAD

$(document).ready(function() {
  sf.chart.splitFlap.init();
});

