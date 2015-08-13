var util = require('./util'),
exporter = function() {
  var parentElem,
  exportFile = function(format) {
    console.log(format);
    util.removeClass("active");
  },
  /**
   * Listen for clicks on the export element
   * @return {[type]} [description]
   */
  listen = function(){
    var exportElement = parentElem.querySelector(".export"),
    format;
    exportElement.addEventListener("click", function(e) {
      util.addClass(exportElement, "active");
      format = e.target.select.value;
      exportFile(format);
    });
  },
  init = function(parentElement){
    parentElem = parentElement;
    listen();
  };
  return {init:init};
};

module.exports = exporter;
