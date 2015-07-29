var assert = require("assert");
var cymine = require("./../js/cymine");
var dummyData = require("./dummyQuery.json");

describe('Node processing', function(){
  describe('#recordsToNodes()', function() {
    it('should return expected number of nodes and edges',function() {
      var processedData = cymine.toNodesAndEdges(dummyData);
      assert.equal(processedData.nodes.length, 28);
      assert.equal(processedData.edges.length, 27);
    });
  });
});
