/*
This file does al of the data transform and prep for the exporters.
 */

var util = require('./../util'),
  svDataFormatter = require('./svDataFormatter')();

var exporter = function() {
  var sv = function(separator, data) {
      var svContent = svDataFormatter.format(separator, data),
        mimeType = "text/" + separator;
      download(svContent, 'results-table.' + separator, mimeType, true);
    },
    prepDownloadString = function(encode, mimeType, content) {
      var imgSrc;
      if (encode) {
        imgSrc = 'data:' + mimeType + ',';
        imgSrc += encodeURIComponent(content);
      } else {
        imgSrc = content;
      }
      return imgSrc;
    },
    /**
     * Download browser-generated file, e.g. csv, tsv.
     * Credit: modified from http://stackoverflow.com/a/29304414/1542891
     * @param  {string} content  The content of the file, e.g. a comma separated string
     * @param  {string} fileName Name you'd like to give to the file
     *                  including extension, e.g. 'myawesomefile.csv'
     * @param  {string} mimeType Mimetype, e.g. 'text/csv'
     * @param  {boolean} encode  encode URI (set false for base64,
     *                   e.g. images URIs)
     * @return {boolean or IE download type}
     */
    download = function(content, fileName, mimeType, encode) {
      var a = document.createElement('a'),
        imgSrc = prepDownloadString(encode, mimeType, content);
        mimeType = mimeType || 'application/octet-stream';
      if (navigator.msSaveBlob) { // IE10
        return navigator.msSaveBlob(new Blob([content], {
          type: mimeType
        }), fileName);
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
    };
    return {
      sv : sv,
      download : download,
      prepDownloadString : prepDownloadString
    };
};

module.exports = exporter;
