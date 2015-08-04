var cymineDataFormatter = require('./dataFormatter'),
imjs = require('./../bower_components/imjs/js/im.js'),
_ = require('underscore'),
cymineDisplay = require('./ui');

//Todo: generify query.
function Cymine(args) {
  var cy,
  graph,
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

  var ui;
  graph = _.extend({},args);
  validateParent();
  ui = new cymineDisplay(graph);
  if (response.length > 0) {
    graph.data = new cymineDataFormatter(response);
    ui.init(graph);
    console.debug('response:', response, 'graphdata:', graph);
  } else {
    ui.noResults(strings.noResults);
  }
});

  function validateParent() {
    if(!graph.parentElem){
      var defaultElem = document.getElementById('cymine');
      if(defaultElem) {
        graph.parentElem = defaultElem;
        console.info('Cymine: No parent element specified for Cymine. Using default #cymine');
      } else {
        console.error('Cymine: No parent element specified, and default "#cymine" not available.');
      }
    }
  }
}

module.exports = Cymine;
