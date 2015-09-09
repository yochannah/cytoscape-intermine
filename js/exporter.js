var util = require('./util'),
exporter = function() {
  var elems = {},
  exportFunction = function() {
    var jpg = function(){
      console.log('yup, jpg');
    },
    svg = function(){
      console.log('svg called');
    },
    csv = function(){
      console.log('csv here');
    }
    return {
      JPG : jpg,
      SVG : svg,
      CSV : csv
    };
  },
  /**
   * Listen for clicks on the export element
   * @return {[type]} [description]
   */
  listen = function(){
    var e = elems;
    e.exportElem = e.parentElem.querySelector(".export");
    e.formatChooser = e.exportElem.querySelector('select');
    e.exportButton = e.exportElem.querySelector('button');
    var exportFile = exportFunction();

    //expand the export thingy
    e.exportElem.addEventListener("click", function() {
      util.addClass(e.exportElem, "active");
    });

    //listen for clicks on the export dropdown 'go' button and initiate export
    e.exportButton.addEventListener("click", function() {
      var format = getFormat();
      try {
        exportFile[format]();
      } catch(error) {
        //this shouldn't really happen if users are selecting from
        //the dropdown list
        console.error("Invalid file format.", error);
      }

      util.removeClass(e.exportElem,"active");
    });

  },
  init = function(parentElement) {
    elems.parentElem = parentElement;
    listen();
  },
  getFormat = function() {
    return elems.formatChooser.value;
  };
  return {init:init};
};

module.exports = exporter;
