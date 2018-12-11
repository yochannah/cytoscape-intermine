/*
  This file serves as the UI manager and entry point for all export functions.
  Data formatting / prep functions should NOT happen here, the should happen in
  exportHelpers.js. This makes loading the helpers file for test purposes really
  easy, with no UI interference.
 */

var util        = require('./../util'),
helpers         = require('./exportHelpers')(),
exporter = function() {
  var elems = {},
  rawData,
  cy,
  exportFunction = function() {
    var jpg = function(){
      helpers.download(cy.jpg(), 'network.jpg');
    },
    png = function(){
      helpers.download(cy.png(), 'network.png');
    },
    csv = function(){
      helpers.sv('csv', rawData);
    },
    tsv = function(){
      helpers.sv('tsv', rawData);
    };
    return {
      jpg : jpg,
      png : png,
      csv : csv,
      tsv : tsv
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
        console.error("Invalid file format: '" + format + "'. ", error);
      }

      util.removeClass(e.exportElem,"active");
    });

  },
  init = function(graph) {
    elems.parentElem = graph.parentElem;
    rawData = graph.rawData;
    cy = graph.cy;
    listen();
  },
  getFormat = function() {
    return elems.formatChooser.value;
  };
  return {init:init};
};

module.exports = exporter;
