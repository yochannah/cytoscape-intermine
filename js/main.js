var cymineDataFormatter = require('./dataFormatter'),
imjs = require('./../bower_components/imjs/js/im.js'),
_ = require('underscore'),
cymineDisplay = require('./ui');

//Todo: generify query.
function Cymine(args) {

  var ui,
  graph = _.extend({},args),
  strings = {
    //use for messages that a user will see
    user : {
      noResults : "No interaction results for this query",
      noQueryData : "Problem loading query results"
    },
    //use for messages intended towards the dev, e.g. console.error();
    dev : {
      noParent : {
        usingDefault : 'Cymine: No parent element specified for Cymine. Using default "#cymine"',
        noDefault : 'Cymine: No parent element specified, and default "#cymine" not available.'
      },
      noQueryData : 'Cymine: No queryOn values supplied!',
      noServiceUrl : 'Cymine: No serviceUrl defined, unable to query for interactions.'
    }
  },
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
  };

  init();

/**
 * Checks if there is indeed an element to attach to, and failing that tries a default.
 * @return {boolean} whether or not we've found an element to attach to. Allows you to cancel the xhr
 *                          since there's nowhere to render it to.
 */
  function validateParent() {
    if(!graph.parentElem){
      var defaultElem = document.getElementById('cymine');
      if(defaultElem) {
        graph.parentElem = defaultElem;
        console.info(strings.dev.noParent.usingDefault);
      } else {
        console.error(strings.dev.noParent.noDefault);
        return false;
      }
    }
    return true;
  }
  function validateServiceRoot(){
    if(graph.serviceUrl){
      return new imjs.Service({root: graph.serviceUrl});
    } else {
      console.error(strings.dev.noServiceUrl);
      ui.init(strings.user.noQueryData);
      return false;
    }

  }
  function prepQuery() {
    if(graph.queryOn) {
      _.extend(query.where[0],graph.queryOn);
      return true;
    } else {
      console.error(strings.dev.noQueryData);
      ui.init(strings.user.noQueryData);
      return false;
    }
  }
  function init(){
    if(validateParent()) {
      ui = new cymineDisplay(graph);
      var mine = validateServiceRoot();
      if(prepQuery() && mine) {
        mine.records(query).then(function(response) {
          if (response.length > 0) {
            graph.data = new cymineDataFormatter(response);
            ui.init();
            console.debug('response:', response, 'graphdata:', graph);
          } else {
            ui.init(strings.user.noResults);
          }
        });
      }
    }
  }
}
module.exports = Cymine;
