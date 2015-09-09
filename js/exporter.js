var util = require('./util'),
svDataFormatter = require('./svDataFormatter')(),
exporter = function() {
  var elems = {},
  rawData,
  exportFunction = function() {
    var jpg = function(){
      console.log('yup, jpg');
    },
    svg = function(){
      console.log('svg called');
    },
    csv = function(){
      console.log('csv here');
      helpers.sv('csv');
    },
    tsv = function(){
      helpers.sv('tsv');
      console.log('tsv here');
    },
    helpers = {
      sv : function(separator) {
        var svContent = svDataFormatter.format(separator, rawData),
        mimeType = "text/" + separator;
        console.log(svContent);
        helpers.download(svContent, 'bob.' + separator, mimeType);
      },
      /**
       * Download browser-generated file, e.g. csv, tsv.
       * Credit: http://stackoverflow.com/a/29304414/1542891
       * @param  {[string]} content  The content of the file, e.g. a comma separated string
       * @param  {[string]} fileName Name you'd like to give to the file including extension, e.g. 'myawesomefile.csv'
       * @param  {[string]} mimeType Mimetype, e.g. 'text/csv'
       * @return {[boolean or IE download type]}
       */
      download : function(content, fileName, mimeType) {
        var a = document.createElement('a');
        mimeType = mimeType || 'application/octet-stream';

        if (navigator.msSaveBlob) { // IE10
          return navigator.msSaveBlob(new Blob([content], { type: mimeType }),     fileName);
        } else if ('download' in a) { //html5 A[download]
          a.href = 'data:' + mimeType + ',' + encodeURIComponent(content);
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
          f.src = 'data:' + mimeType + ',' + encodeURIComponent(content);

          setTimeout(function() {
            document.body.removeChild(f);
          }, 333);
          return true;
        }
      }
    };
    return {
      jpg : jpg,
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
      console.log
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
    rawData = graph.rawData
    listen();
  },
  getFormat = function() {
    return elems.formatChooser.value;
  };
  return {init:init};
};

module.exports = exporter;
