/**
 * Relatively hardcoded csv/tsv data formatter for the export tool for the gene interaction graph
 * Could possibly one day be generalised to not hard-map columns?
 * @param  {[type]} separator [description]
 * @param  {[type]} data      [description]
 * @return {[type]}           [description]
 */
var sv = function() {
  var makeHeaders = function(separator, data){
    //this is a direct copy from the java csv export
    //todo in future: make this extensible?
    var headers = [
      "Gene > Symbol","Gene > DB identifier","Gene > Interactions > Details > Type","Gene > Interactions > Gene 2 . Symbol","Gene > Interactions > Gene 2 > DB identifier","Gene > Interactions > Details > Data Sets > Data Source > Name"
    ];
    return headers.join(separator);
  },
  makeData = function(rawData){
    var data = [], temp, row, detail;
    rawData = rawData[0];
    for(var i = 0; i < rawData.interactions.length; i++) {
      row = rawData.interactions[i];
      //console.log('row', row); //your boat
      temp = [
        rawData.symbol,                                                     //0
        rawData.primaryIdentifier,                                          //1
        //details.type are inserted at index 2 (here) in the next step      //2
        row.participant2.symbol,                                                   //3
        row.participant2.primaryIdentifier,                                        //4
        //index 5: add details.datasets.datasource.name                     //5
      ];
      data = data.concat(makeRowsWithDetails(temp,row.details));
      //there are multiple 'details' rows, so we need to do a further iteration
    }
    return data;
  },
  makeRowsWithDetails = function(rowArray, details){
    var rows = [], temp;
    for(var i = 0; i < details.length; i++) {
      detail = details[i];
      //clone temp, as we need to use it several times.
      temp = rowArray.slice(0);
      //insert detail.type at index 2
      temp.splice(2, 0, detail.type);
      //add index 5
      rows = rows.concat(makeRowsWithDataSets(temp, detail.dataSets));
    }
    return rows;
  },
  makeRowsWithDataSets = function(rowArray, dataSets){
    var rows = [],temp;
    for(var i = 0; i < dataSets.length; i++) {
      ds = dataSets[i];
      //clone temp, as we need to use it several times.
      temp = rowArray.slice(0);
      temp.push(ds.name);
      rows.push(temp);
    }
    return rows;
  },
  format = function(separator, data) {
    var separators = {
      csv : ",",
      tsv : "\t"
    },
    svContent = makeHeaders(separators[separator],data) + "\n",
    dataArray = makeData(data);
    dataArray.forEach(function(infoArray, index){
      dataString = infoArray.join(separators[separator]);
      svContent += dataString + "\n";
    });
    return svContent;
  };
  return {format:format};
};
module.exports = sv;
