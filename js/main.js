var cymineDataFormatter = require('./dataFormatter'),
imjs = require('./../bower_components/imjs/js/im.js'),
_ = require('underscore'),
cymineDisplay = require('./ui');

//Todo: generify query.
function Cymine(args) {

  graph = _.extend({},args);
  var mine = new imjs.Service({root: graph.serviceUrl}),
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
        "code": "A",
        "editable": true,
        "switched": "LOCKED",
        "switchable": false,
      }
    ]
  },
  strings = {
    noResults : "No interaction results for this query"
  };

  console.log('hullo2');
prepQuery();

mine.records(query).then(function(response) {
  console.log('hullo');
  var ui;
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
  function prepQuery() {
    _.extend(query.where[0],graph.query.where);
  }
}
module.exports = Cymine;
