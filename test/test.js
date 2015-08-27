var assert = require("assert");
var cymine = require("./../js/dataFormatter");
var dummyData = require("./dummyQuery.json");

console.log("===");
console.log("Running tests at " + new Date().toString() + ":");


describe('Node & Edge processing', function(){
  var graph = new cymine(dummyData);
  describe('#recordsToNodes()', function() {
    //I suspect this will need to be revised when I expand it to more advanced use cases
    it('should return expected number of nodes and edges',function() {
      assert.equal(graph.nodes.length, 30);
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
