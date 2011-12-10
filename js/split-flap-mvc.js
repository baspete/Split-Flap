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

/* ********************************************************************* */
/* DISPLAY METHODS                                                       */

sf.display = {

  // DRUM ARRAYS
  // These contain the character sets for each drum. Each position represents
  // a character and when prepended by "c" gives the class name which will
  // be applied to display that character.
  FullDrum: function() {
    this.order = [' ','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','.',',','?','!','/','\'','+','-','↑','↓'];
  },
  CharDrum: function() {
    this.order = [' ','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','.',','];
  },
  NumDrum: function() {
    this.order = [' ','0','1','2','3','4','5','6','7','8','9','.',','];
  },
  // ImageDrum is empty here. Override in plugins/<plugin_name>/custom.js
  ImageDrum: function() {}, 

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
        input = input.toString(), // force it into a string
        target = arguments[1], // the group object
        elements = target.find("div"),
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
    }
    container.fadeOut(50, function(){
      container.removeClass().addClass(c);
    }).fadeIn(50);
  },

  // Utility method to clear the board.
  // It goes through every group in every row,
  // calling loadGroup() with an empty string.
  clear: function() {
    var container = arguments[0],
        rows = container.find(".row"),
        i=0;
    var loop = function() {
      setTimeout(function () {
        var groups = $(rows[i]).find(".group");
        groups.each(function(){
          sf.display.loadGroup("",$(this));
        })
        i++;
        if (i < rows.length) {
          loop(i); 
        }
       }, 500);
    };
    loop();
   }

};
/* END DISPLAY METHODS                                                   */
/* ********************************************************************* */
