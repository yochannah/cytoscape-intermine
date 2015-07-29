var assert = require("assert");
var cymine = require("./../js/cymine");
var dummyData = require("./dummyQuery.json");

describe('Node processing', function(){
  describe('#recordsToNodes()', function() {
    var graph = cymine.toNodesAndEdges(dummyData);

    it('should return expected number of nodes and edges',function() {
      assert.equal(graph.nodes.length, 28);
      assert.equal(graph.edges.length, 27);
    });

    it('should give every node a name',function() {
      var hasNames = true;
      for(var i in graph.nodes){
        hasNames = graph.nodes[i].data.symbol && hasNames;
      }
      assert(hasNames);
    });

  });
});
