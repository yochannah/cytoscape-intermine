var cymine = require('./cymine'),
cytoscape = require('./../bower_components/cytoscape/dist/cytoscape'),
imjs = require('./../bower_components/imjs/js/im.js');

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

      var graphdata = cymine.toNodesAndEdges(response),
      targetElem = document.getElementById('cy');

      console.debug('response:', response, 'graph data', graphdata);

      cy = cytoscape({
        container: targetElem,
        layout: { name: 'cose'},
        style: [
          {
            selector: 'node',
            style: {
              'content': 'data(symbol)',
            }
          }
        ],
        elements: graphdata,
        ready: function(){
          window.cy = this;
          targetElem.querySelector('.loader').remove();
          }
      });

    } catch(e) {console.error(e);}
  } else {
    console.log("No results.");
  }
});
