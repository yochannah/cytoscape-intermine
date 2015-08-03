var cymineDataFormatter = require('./cymineDataFormatter'),
imjs = require('./../bower_components/imjs/js/im.js'),
cymineDisplay = require('./ui');

//Todo: generify query.
var cy,
humanmine = new imjs.Service({root: 'www.humanmine.org/humanmine'}),
query = {
  "name": "Gene_Interactions",
  "title": "Gene --> Interactions",
  "description": "Show all interactions for a given gene.",
  "constraintLogic": "A and B",
  "from": "Gene",
  "select": [
    "primaryIdentifier",
    "symbol",
    "interactions.gene2.symbol",
    "interactions.gene2.primaryIdentifier",
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
},
strings = {
  noResults : "No interaction results for this query"
};

humanmine.records(query).then(function(response) {
  var ui, graph = {};
  graph.targetElem = document.getElementById('cy');
  graph.statusBar = graph.targetElem.querySelector('.status');

  ui = new cymineDisplay(graph);

  if (response.length > 0) {
    graph.data = new cymineDataFormatter(response);
    ui.init(graph);
    console.debug('response:', response, 'graph data', graph);
  } else {
    ui.noResults(strings.noResults);
  }
});
