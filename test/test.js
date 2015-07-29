var assert = require("assert");
var cymine = require("./../js/cymine");
var dummyData = require("./dummyQuery.json");

describe('Node processing', function(){
  describe('#recordsToNodes()', function() {
    var graph = cymine.toNodesAndEdges(dummyData);

    //I suspect this will need to be revised when I expand it to more advanced use cases
    it('should return expected number of nodes and edges',function() {
      assert.equal(graph.nodes.length, 28);
      assert.equal(graph.edges.length, 27);
    });

    it('should give every node a label',function() {
      var hasNames = true;
      for(var i in graph.nodes){
        //hasNames becomes falsey if there is a null value
        hasNames = graph.nodes[i].data.label && hasNames;
      }
      assert(hasNames);
    });

  });
});
