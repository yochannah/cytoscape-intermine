var assert = require("assert");
var cymine = require("./../js/dataFormatter");
var dummyData = require("./dummyQuery.json");

describe('Node & Edge processing', function(){
  var graph = new cymine(dummyData);
  describe('#recordsToNodes()', function() {
//    console.log(graph);
//
    //I suspect this will need to be revised when I expand it to more advanced use cases
    it('should return expected number of nodes and edges',function() {
      assert.equal(graph.nodes.length, 28);
      assert.equal(graph.edges.length, 27);
    });

    var hasNames = true,
    hasInteraction = true;
    for(var i in graph.nodes){
      //becomes falsey if there is a null value
      hasNames = graph.nodes[i].data.label && hasNames;
      if(graph.nodes[i].data.interactionType !== "master") {
        hasInteraction = graph.nodes[i].data.interactionType && hasInteraction;
      }
    }


    it('should give every node a label',function() {
      assert(hasNames);
    });
    it('should give every node (except the original) an interaction property',function() {
      assert(hasInteraction);
    });
  });

  describe('#recordsToEdges()', function() {
    it('should give every edge an interaction property',function() {
      var hasTypes = true;
      for(var i in graph.edges){
        //hasNames becomes falsey if there is a null value
        hasTypes = graph.edges[i].data.interactionType && hasTypes;
      }
      assert(hasTypes);
    });

    console.log("===");
  });
});
