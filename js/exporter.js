var util = require('./util'),
exporter = function() {
  var elems = {},
  exportFile = function(format) {
    console.log(format);
    //TODO
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

    //expand the export thingy
    e.exportElem.addEventListener("click", function() {
      util.addClass(e.exportElem, "active");
    });

    //listen for clicks on the export dropdown 'go' button and initiate export
    e.exportButton.addEventListener("click", function() {
      var format = getFormat();
      exportFile(format);

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
