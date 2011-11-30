// Home Sweet Global Namespace
var sf = {};

// Namespace for objects defined and used locally in templates
sf.local = {};

/* ********************************************************************* */
/* HOUSEKEEPING                                                          */

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

sf.chart = {

  /* ********************************************************************* */
  /* DATA RETRIEVAL AND FORMATTING                                         */

  init: function() {
    sf.chart.splitFlap.init();
  },

  dataSrc: "data/category.php", // optionally override in template
  
  dataUrl: function() {
    var params = arguments[0];
    return sf.chart.dataSrc + "?" + params;
  },
  
  formatData: function() {
    // The "data" node in this map uses category names as labels. Because there 
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
    // 
    var input = arguments[0],
        format = arguments[1],
        options = arguments[2],
        series = input.data,
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
    // pick up any sorting options (default is ascending)
    if(options.sort) {
      if(options.order === "desc") {
        output.sort(function(a,b){
          return a.data[options.sort]>b.data[options.sort]?-1:1;
        });
      } else {
        output.sort(function(a,b){
          return a.data[options.sort]>b.data[options.sort]?1:-1;
        });
      }
    } else {
      // otherwise use the label
      if(options.order === "desc") {
        output.sort(function(a,b){
          return a.label>b.label?-1:1;
        });
      } else {
        output.sort(function(a,b){
          return a.label>b.label?1:-1;
        });
      }
    }
    // second pass: truncate/maxResults
    for(i=0;i < output.length; i++){
      if(i >= options.truncate) {
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
      } else { // note that this case also covers "undefined" 
        truncatedOutput.push(output[i]);
      }
      // bail if we hit maxResults
      if(i+1 === parseInt(options.maxResults,10)) { // note counting starts with 1
        break;
      }
    }
    // populate "Other" node
    if(other.length > 0) {
      truncatedOutput.push( {"label" : "other", "data" : other, "color": "#EFEFEF" } );
    }
    return truncatedOutput;
  },

  load: function() {
    // Given a DOM object, this method retrieves the data from the server
    // and passes it to the correct chart type render() method. 
    // 
    // The JSON model we're expecting from the data source is (for example):
    // {
    //   "response": { 
    //     "results": [ 
    //       { 
    //         "data" : { 
    //           "101" : ["0728", "London", "0", "C21", "1", "est 2130+"], 
    //           "96"  : ["0952", "Madrid", "1", "A7", "0", ""]
    //         }
    //       } 
    //     ] 
    //   }
    // }
    // 
    var container = arguments[0]; // expects the container object
    // make an array containing the values we're going to ignore
    var ignores = [];
    container.find("input[name=ignore]").each(function() {
      ignores.push($(this).val());
    });
    var dataOptions = {
      "sort": container.find("input[name=sort]").val(),
      "order": container.find("input[name=order]").val(),
      "truncate": container.find("input[name=truncate]").val(),
      "maxResults": container.find("input[name=maxResults]").val(),
      "ignore": ignores
    };
    var params = container.find(".chartPrefs input").serialize();
    $.getJSON(
      sf.chart.dataUrl(params),
      function(json) {
        var i,
            results = json.response.results;
        for(i=0;i<results.length;i++){
          var formattedData = sf.chart.formatData(results[i], "category", dataOptions);
          if(formattedData.length > 0) {
            sf.chart.splitFlap.render(formattedData, container);
          }  else {  // OTHERWISE, NO DATA!
            container.html("<div class='empty'>No Data</div>");
          }
        }
      }
    );

  },

  /* END DATA RETRIEVAL AND FORMATTING                                     */
  /* ********************************************************************* */


  /* ********************************************************************* */
  /* SPLIT FLAP                                                            */

  splitFlap: {
    
    // DRUM ARRAYS
    // These contain the character sets for each drum. Each position represents
    // a character and when prepended by "c" gives the class name which will
    // be applied to display that character.
    // Note that the LogoDrum is indexed, so the classes will be like "c0", "c1", etc.
    FullDrum: function() {
      this.order = [' ','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','.',',','?','!','/','\'','+','-','↑','↓'];
    },
    CharDrum: function() {
      this.order = [' ','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','.',','];
    },
    NumDrum: function() {
      this.order = [' ','0','1','2','3','4','5','6','7','8','9','.',','];
    },
    LogoDrum: function() {
      this.order = [' ','0','1','2','3','4','5','6','7','8','9'];
    },

    init: function() {
      
      // For each character, construct a drum array and
      // attach that array to the element's .data() object
      $(".splitflap span").each(function() {
        var parent = $(this).closest("div");
        if(parent.hasClass("number")){
          var drum = new sf.chart.splitFlap.NumDrum(); // Numbers only
        } else if(parent.hasClass("character")) {
          var drum = new sf.chart.splitFlap.CharDrum(); // Characters only
        } else if(parent.hasClass("logo")) {
          var drum = new sf.chart.splitFlap.LogoDrum(); // Logos
        } else {
          var drum = new sf.chart.splitFlap.FullDrum(); // The full set
        }
        $(this).data("order", drum.order);
        // Finally, set each character to a space.
        sf.chart.splitFlap.change($(this), " ");
      });
    
    },
  
    render: function() {
      var input = arguments[0],
          container = arguments[1],
          rows = container.find(".row"),
          i=0;
      var loop = function() {
        setTimeout(function () {
          if(input[i]) {
            sf.chart.splitFlap.loadRow(input[i],$(rows[i]));
          }
          i++;
          if (i < rows.length) {
            loop(i); 
          }
         }, 500);
      };
      loop();
    },
    
    loadRow: function() {
      var input = arguments[0],
          row = arguments[1], // the row object
          j,group;
      // first, load the label into the .label group
      group = row.find(".label");
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
      if(target.hasClass("status")) { // status renders differently--it just adds the class "on" to the correct element
        target.find("div").removeClass("on");
        target.find(".s"+input).addClass("on");
      } else {  // otherwise, this group is composed of split-flap elements
        input = input.toUpperCase();
        // get individual characters and pad the array 
        // with spaces (to clear any existing characters)
        characters = input.split("");
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
    },

    // Utility method to clear the board
    clear: function() {
      var container = arguments[0],
          rows = container.find(".row"),
          i=0;
      var loop = function() {
        setTimeout(function () {
          sf.chart.splitFlap.loadRow({"label":"","data":["","","","","","","","","",""]},$(rows[i]));
          i++;
          if (i < rows.length) {
            loop(i); 
          }
         }, 500);
      };
      loop();
     }
  
  }
  /* END SPLIT FLAP                                                        */
  /* ********************************************************************* */
  
};

/* ********************************************************************* */
/* DOCUMENT LOAD                                                         */

$(document).ready(function() {
  sf.chart.init();
});

