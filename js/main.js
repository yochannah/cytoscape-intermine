var cymine = require('./cymine'),
cytoscape = require('./../bower_components/cytoscape/dist/cytoscape'),
imjs = require('./../bower_components/imjs/js/im.js'),
nodeDataDisplay = require('./nodeDataDisplay');

//Todo: generify query.
var cy, humanmine = new imjs.Service({root: 'www.humanmine.org/humanmine'}),
query = {
  "name": "Gene_Interactions",
  "title": "Gene --> Interactions",
  "description": "Show all interactions for a given gene.",
  "constraintLogic": "A and B",
  "from": "Gene",
  "select": [
    "symbol",
    "interactions.gene2.symbol",
    "interactions.details.name",
    "interactions.details.role1",
    "interactions.details.role2",
    "interactions.details.type",
    "interactions.details.experiment.interactionDetectionMethods.name",
    "interactions.details.experiment.publication.pubMedId",
    "interactions.details.relationshipType.name",
    "interactions.details.dataSets.name"
  ],
  "orderBy": [
    {
      "path": "symbol",
      "direction": "ASC"
    }
  ],
  "where": [
    {
      "path": "Gene",
      "op": "LOOKUP",
      "value": "PPARG",
      "extraValue": "H. sapiens",
      "code": "A",
      "editable": true,
      "switched": "LOCKED",
      "switchable": false
    }
  ]
};

humanmine.records(query).then(function(response) {
  if (response) {
    try {

      var graph = {};
        graph.data = cymine.toNodesAndEdges(response),
        graph.targetElem = document.getElementById('cy'),
        graph.statusBar = graph.targetElem.querySelector('.status');

      console.debug('response:', response, 'graph data', graph.data);

      cy = cytoscape({
        container: graph.targetElem,
        layout: { name: 'cose'},
        style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(label)'
      })
    .selector(':selected')
      .css({
        'background-color': 'black',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'source-arrow-color': 'black',
        'text-outline-color': 'black'
      }),
        elements: graph.data,
        ready: function(){
          window.cy = this;
          graph.statusBar.remove();
        }
      });

      cy.on('tap', 'node', function(){
        nodeDataDisplay.display(this.data());
      });


    } catch(e) {console.error(e);}
  } else {
    //todo make sure error handling works
    graph.statusBar.class = "status no-results";
  }
});
