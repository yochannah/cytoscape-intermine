var sv = function() {
  var makeHeaders = function(separator, data){
    //this is a direct copy from the java csv export
    //todo in future: make this extensible?
    var headers = [
      "Gene > Symbol","Gene > DB identifier","Gene > Interactions > Details > Type","Gene > Interactions > Gene 2 . Symbol","Gene > Interactions > Gene 2 > DB identifier","Gene > Interactions > Details > Data Sets > Data Source > Name","Gene > Interactions > Details > Experiment > Publication > Title","Gene > Interactions > Details > Experiment > Publication > PubMed ID"
    ]
    return headers.join(separator);
  },
  format = function(separator, data) {
    var separators = {
      csv : ",",
      tsv : "\t"
    },
//    data = [['cat','meow'],['dog','bark']],
    svContent = makeHeaders(separators[separator],data);
/*    data.forEach(function(infoArray, index){
      dataString = infoArray.join(separators[separator]);
      svContent += index < data.length ? dataString+ "\n" : dataString;
    });*/
    return svContent;
  }
  return {format:format};
}
module.exports = sv;
