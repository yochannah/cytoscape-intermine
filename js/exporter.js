var util = require('./util'),
svDataFormatter = require('./svDataFormatter')();
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
      helpers.sv('csv');
    },
    tsv = function(){
      helpers.sv('tsv');
    },
    helpers = {
      sv : function(separator) {
        var svContent = svDataFormatter.format(separator, rawData),
        mimeType = "text/" + separator;
        helpers.download(svContent, 'results-table.' + separator, mimeType, true);
      },
      /**
       * Download browser-generated file, e.g. csv, tsv.
       * Credit: modified from http://stackoverflow.com/a/29304414/1542891
       * @param  {string} content  The content of the file, e.g. a comma separated string
       * @param  {string} fileName Name you'd like to give to the file
       *                    including extension, e.g. 'myawesomefile.csv'
       * @param  {string} mimeType Mimetype, e.g. 'text/csv'
       * @param  {boolean} encode  encode URI (set false for base64, e.g. images URIs)
       * @return {boolean or IE download type}
       */
      download : function(content, fileName, mimeType, encode) {
        var a = document.createElement('a'),
        mimeType = mimeType || 'application/octet-stream',
        imgSrc;

        if (encode) {
          imgSrc = 'data:' + mimeType + ',';
          imgSrc += encodeURIComponent(content);
        } else {
          imgSrc = content;
        }

        if (navigator.msSaveBlob) { // IE10
          return navigator.msSaveBlob(new Blob([content], { type: mimeType }),     fileName);
        } else if ('download' in a) { //html5 A[download]
            a.href += imgSrc;
          a.setAttribute('download', fileName);
          document.body.appendChild(a);
          setTimeout(function() {
            a.click();
            document.body.removeChild(a);
          }, 66);
          return true;
        } else { //do iframe dataURL download (old ch+FF):
          var f = document.createElement('iframe');
          document.body.appendChild(f);
          f.src = imgSrc;

          setTimeout(function() {
            document.body.removeChild(f);
          }, 333);
          return true;
        }
      }
    };
    return {
      jpg : jpg,
      png : png,
      svg : svg,
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
