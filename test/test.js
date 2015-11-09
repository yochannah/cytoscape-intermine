var assert = require("assert");
var cymine = require("./../js/dataFormatter");
var svDataFormatter = require('./../js/exporter/svDataFormatter')();
var exporter = require('./../js/exporter/exportHelpers')();
var dummyData = require("./dummyQuery.json");
var strings = require('./testStrings');

console.log("===");
console.log("Running tests at " + new Date().toString() + ":");


describe('Node & Edge processing', function(){
  var graph = new cymine(dummyData);
  describe('#recordsToNodes()', function() {
    //I suspect this will need to be revised when I expand it to more advanced use cases
    it('should return expected number of nodes and edges',function() {
      assert.equal(graph.nodes.length, 29);
      assert.equal(graph.edges.length, 29);
    });

    var hasNames = true,
    hasInteraction = true;
    for(var i in graph.nodes){
      //becomes falsey if there is a null value
      hasNames = graph.nodes[i].data.label && hasNames;
      if(graph.nodes[i].data.interactionType !== ["master"]) {
        hasInteraction = graph.nodes[i].data.interactionTypes && hasInteraction;
      }
    }


    it('should give every node a label',function() {
      assert(hasNames);
    });
    it('should give every node (except the original) an interaction property',function() {
      assert(hasInteraction);
    });
  });

  describe('Master Node', function(){ //e.g. the node for Mad on the Mad gene report page.
    //in some scenarios the master node was overwritten and it lost the 'master' class
    //which threw everything off when showing/hiding the physical and genetic interactions

    var masterNodes = [];
    for(var i in graph.nodes){
      //becomes falsey if there is a null value
      if(graph.nodes[i].classes == ["master"]) {
        masterNodes.push(graph.nodes[i]);
      }
    }
    
    it('should always be present, and only one master ever present', function(){
      assert.equal(masterNodes.length, 1);
    });
  });

  describe('Edges', function() {
    it('should give every edge an interaction property',function() {
      var hasTypes = true;
      for(var i in graph.edges){
        //hasNames becomes falsey if there is a null value
        hasTypes = graph.edges[i].data.interactionType && hasTypes;
      }
      assert(hasTypes);
    });

    //mad in the (totally faked) sample data should have three interactions,
    //two physical and one genetic
    var madEdges = [], edge, madPhysicalEdgesCount = 0;
    for(var i=0;i<graph.edges.length;i++) {
      edge = graph.edges[i];
      if(edge.data.title === 'Interaction between PPARG and Mad') {
        madEdges.push(edge);
        if(edge.data.interactionType === "physical") {madPhysicalEdgesCount++;}
      }
    }

    it('should make multiple edges between the same nodes if there are multiple interactions',function() {
      assert(madEdges.length === 2);
    });

    it('should NOT allow multiple edges between the same nodes of the same type',function() {
      assert(madPhysicalEdgesCount === 1);
    });
    console.log("===");
  });
});

describe('Exporter', function(){
  describe('Creates CSV/TSV correctly', function(){
    var csvString, tsvString, csvData, tsvData;
    before(function(){
      //snip the dummy data into a manageable state
      var exportData = JSON.parse(JSON.stringify(dummyData));
      exportData[0].interactions = exportData[0].interactions.slice(0,2); //2 rows only

      //make csv test data
      csvData = svDataFormatter.format('csv', exportData);
      csvString = exporter.prepDownloadString('csv', 'text/csv', csvData);

      //make tsv test data
      tsvData = svDataFormatter.format('tsv', exportData);
      tsvString = exporter.prepDownloadString('tsv', 'text/tsv', tsvData);
    });

    it('should have the correct number of commas in the CSV file', function() {
      //this is counted as five commas per row returned.
      assert(csvData.split(",").length === 31);
      assert(csvData.split(",").length !== 30);
    });
    it('should have the correct number of tabs in the TSV file', function() {
      assert(tsvData.split(/\t/).length === 31);
      assert(tsvData.split(/\t/).length !== 30);
    });
    it('should contain the correct column names', function() {
      assert(tsvData.split('\n')[0] === makeHeaders('\t'));
      assert(csvData.split('\n')[0] === makeHeaders(','));
    });
    it('should have the correct number of rows', function() {
      //this takes into account an empty newline at the end of the doc
      assert(tsvData.split('\n').length === 7);
      assert(csvData.split('\n').length === 7);
    });
    it('should convert to encoded string for download correctly', function(){
      assert(tsvString == strings.tsvExportedString);
      assert(csvString == strings.csvExportedString);
    })
  });
});


function makeHeaders(separator){
  //this is a direct copy from the java csv export
  //todo in future: make this extensible?
  var headers = [
    "Gene > Symbol","Gene > DB identifier","Gene > Interactions > Details > Type","Gene > Interactions > Gene 2 . Symbol","Gene > Interactions > Gene 2 > DB identifier","Gene > Interactions > Details > Data Sets > Data Source > Name"
  ]
  return headers.join(separator);
}
