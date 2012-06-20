// Home Sweet Global Namespace
var sf = {};

// Namespace for objects defined and used locally in templates
sf.local = {};

// Namespace for plugin-specific javascript,
// to be loaded later in separate files
sf.plugins = {};

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

sf.util = {

  // Function splits string into array of substrings of len or less.
  // Splits happen at the last space.
  splitString: function(str,len){
    var arr = [];
    var words = str.split(" ");
    var line = words[0];
    for(var i=1;i<words.length;i++){
      if(line.length + words[i].length + 1 < len + 1){
        line = line + " " + words[i];
      } else {
        arr.push(line);
        line = words[i];
      }
    }
    // push the last line into the array
    arr.push(line);
    return arr;
  },

  // Methods for getting query parameters out of the URL
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

};

/* ********************************************************************* */
/* BACKBONE COLLECTIONS, MODELS AND VIEWS                                */

// This View generates the empty markup for the rows
// It is only called once, at document.ready()
// By default it sets 12 rows. Set sf.options.numRows to change this.
sf.Board = Backbone.View.extend({
  render: function() {
    this.el.find(".row").remove();
    for(var i=0;i<(sf.options.numRows);i++){
      this.el.append(this.template());
    };
    this.el.find(".row").each(function(){
      sf.display.initRow($(this));
    });
    return this;
  }
});

sf.board = {

  // Generate the markup for and initialize a blank board
  init: function(options){
    var board = new sf.Board;
    board.el =  options.container;
    board.template = _.template(options.template.html());
    sf.options.numRows = sf.options.numRows ? sf.options.numRows : 12; // default 12 rows
    board.render();
  },

  // Utility method to clear the board.
  // It goes through every group in every row,
  // calling loadGroup() with an empty string.
  // When it gets to the last row it reloads the page.
  // NOTE: Use this to avoid memory leaks -- call it every hour or so.
  clear: function(container) {
    var rows = container.find(".row"),
        i=0;
    var loop = function() {
      setTimeout(function () {
        var groups = $(rows[i]).find(".group");
        groups.each(function(){
          sf.display.loadGroup(" ",$(this));
        })
        i++;
        if (i < rows.length) {
          loop(i);
        } else {
          // give it 10 seconds to finish clearing
          // the board, then reload the page.
          setTimeout(function(){
            window.location.reload();
          }, 10*1000)
        }
       }, 500);
    };
    loop();
   }

};

// This Collection is used to hold the datset for this board.
// If there's more results than rows, it will page the results
// at options.pageInterval.
sf.Items = Backbone.Collection.extend({
  update: function(options){
    this.fetch({
      success: function(response){
        var results = response.toJSON(),
            maxResults = options.maxResults ? options.maxResults : 24,
            numResults = results.length <= maxResults ? results.length : maxResults,
            numRows = options.numRows,
            numPages = Math.ceil(numResults/numRows),
            pageInterval = options.pageInterval ? options.pageInterval : 30000,
            i=0,page=0;
            // Load initial results
            sf.display.loadSequentially(results.slice(i,i+numRows),options.container);
            // console.log("results at page",page,"index",i,results.slice(i,i+numRows));
            i += numRows;
            page++;
            // This recursive function loops through the results by page
            loop = function() {
              setTimeout(function () {
                sf.display.loadSequentially(results.slice(i,i+numRows),options.container);
                // console.log("results at page",page,"index",i,results.slice(i,i+numRows));
                i += numRows;
                page++;
                if (page < numPages) {
                  loop(i);
                }
               }, pageInterval);
            };
        loop();
      }
    });
  },
  parse: function(json){
    return(sf.plugins[sf.options.plugin].formatData(json)); // normalize this data
  }
});

sf.items = {

  // Get the data for a board and load it
  init: function(options) {
    // create the Collection
    items = new sf.Items; // NOTE GLOBAL!
    items.url = sf.plugins[options.plugin].url(options);

    // check if we're using jsonp
    if(sf.plugins[options.plugin].dataType ==="jsonp"){
      items.sync = function(method, model, options){
        options.timeout = 10000;
        options.dataType = "jsonp";
        return Backbone.sync(method, model, options);
      };
    }

    // pick up any sorting options
    if(options.order && options.sort){
      items.comparator = function(item){
        if(options.order === "desc"){
          return -item.get(options.sort);
        } else {
          return item.get(options.sort);
        }
      };
    }
  },

  load: function(options){

    // Set a count to keep track of how many times the page has been refreshed.
    // When count has reached options.pageReloadAt, clear the board and reload the window.
    var count = 1;
    var pageReloadAt = options.pageReloadAt ? options.pageReloadAt : 120;

    // Get the initial data and load the chart
    items.update(options);

    // If user has specified a refresh interval, setInterval()
    if(options.refreshInterval){
      setInterval(function(){

        if(count < pageReloadAt){
          items.update(options);
          count = count + 1;
        } else {
          sf.board.clear(options.container);
        }

      }, options.refreshInterval);
    }
  }

},

/* ********************************************************************* */
/* DISPLAY METHODS                                                       */

sf.display = {

  // DRUM ARRAYS
  // These contain the character sets for each drum. Each position represents
  // a character and when prepended by "c" gives the class name which will
  // be applied to display that character.
  FullDrum: function() {
    this.order = [' ','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','.',',','?','!','/','\'','+','-',':','@','#'];
  },
  CharDrum: function() {
    this.order = [' ','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','.',','];
  },
  NumDrum: function() {
    this.order = [' ','0','1','2','3','4','5','6','7','8','9','.',','];
  },
  ImageDrum: function() {
    this.order = []; // Intentionally empty here. Override in plugins/<plugin_name>/custom.js
  },

  initRow: function(row) { // expects the jQuery DOM object
    // For each character, construct a drum array and
    // attach that array to the element's .data() object
    row.find("span").each(function() {
      var parent = $(this).closest("div");
      if(parent.hasClass("number")){
        var drum = new sf.display.NumDrum(); // Numbers only
      } else if(parent.hasClass("character")) {
        var drum = new sf.display.CharDrum(); // Characters only
      } else if(parent.hasClass("image")) {
        var drum = new sf.display.ImageDrum(); // Images
      } else {
        var drum = new sf.display.FullDrum(); // The full set
      }
      $(this).data("order", drum.order);
      // Finally, set each character to a space.
      sf.display.change($(this), " ");
    });
  },

  loadSequentially: function() {
    var input = arguments[0],
        container = arguments[1],
        rows = container.find(".row"),
        i=0,
        stagger = sf.options.stagger ? sf.options.stagger : 1000;
    var loop = function() {
      setTimeout(function () {
        if(input[i]) {
          sf.display.loadRow(input[i],$(rows[i]));
        }
        i++;
        if (i < rows.length) {
          loop(i);
        }
       }, stagger);
    };
    loop();
  },

  loadRow: function() {
    var input = arguments[0],
        row = arguments[1], // the row object
        key,group;
    // load the keys array into the .[key] groups
    for(key in input) {
      if(input.hasOwnProperty(key)){
        group = row.find("."+key);
        if(group.length > 0) {
          sf.display.loadGroup(input[key], group);
          // put that value into that group's data store
          group.data("contents",input[key]);
        }
      }
    }
  },

  loadGroup: function() {
    // load a string into a group of display elements
    var input = arguments[0], // the input (which may be a string or a int)
        input = input+"", // force it into a string
        target = arguments[1], // the group object
        elements = target.find("span").closest("div"), // may have separators, so check for spans
        strLen = elements.size(),
        i, characters;
    // ###################################
    // STATUS INDICATORS
    // Add the class "on" to the correct element
    if(target.hasClass("status")) {
      target.find("div").removeClass("on");
      target.find(".s"+input).addClass("on");

    // ###################################
    // IMAGES
    // Only one display element--no need to iterate
    } else if(target.find(".image").length > 0){
      sf.display.change(target.find("span"), input, false);

    // ###################################
    // NORMAL CHARACTERS
    // otherwise, this group is composed of split-flap character or number elements
    } else {
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
        sf.display.change($(elements[i]).find("span"), characters[i], true);
      }
    }

  },

  change: function() {
    var container = arguments[0],
        c = arguments[1], // the new character
        isChar = arguments[2], // true if this is an character (not an image)
        index, i, j;
    // get the curent order of the display element's drum
    var values = container.data("order");
    // how many times do we need to increment the drum?
    index = values.indexOf(c);
    // increment the drum
    for(i=0;i<index;i++) {
      sf.display.show(container, (values[i + 1]), isChar);
    }
    // rotate the dom element's stored array to the new order for next time
    container.data("order", values.rotate(index));
  },

  show: function() {
    var container = arguments[0],
        i = arguments[1],
        isChar = arguments[2],
        c;
    c = isChar ? "c"+(i) : (i); // character class names are preceded by "c"
    // punctuation has special class names
    // TODO: can we be more efficient here? This method gets called a lot!
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
      case "%": c = "cpct"; break;
    }
    container.fadeOut(50, function(){
      container.removeClass().addClass(c);
    }).fadeIn(50);
  }

};
/* END DISPLAY METHODS                                                   */
/* ********************************************************************* */
