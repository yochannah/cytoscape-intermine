(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var cymine = {
  toNodesAndEdges : function(records, parentNode){
    var d = {
      nodes : [],
      edges : []
    },
    parentNode = parentNode;

    for (var i in records) {
      var thisNode, row = records[i];
      thisNode = this.recordToNode(row);

      //TODO: add test to make sure we're getting the correct number of
      //nodes and the correct data structure. It's too easy to break.
      if(row.interactions) {
        //recursively make the interactions into nodes,
        //because node entities are nested at two levels.
        d = this.mergeObjects(d, this.toNodesAndEdges(row.interactions, thisNode));
      } else {
        //if it doesn't have an interaction list, it probably *is* an interaction
        //and thus needs to be an edge
        d.edges.push(this.interactionToEdge(parentNode, thisNode));

      }
      d.nodes.push(thisNode);

    }

    return d;
  },
  recordToNode : function (obj) {
    var ret;
    ret = obj.gene2 ? obj.gene2 : obj;
    return {
      data : {
        class : ret.class,
        symbol : ret.symbol,
        id : ret.objectId.toString() //cytoscape needs strings
      }
    }
  },
  interactionToEdge : function(node, node2) {
    //todo: we almost certainly want to add more complexity to the return object
    return {
      data : {
        source : node.data.id,
        target : node2.data.id
      }
    };
  },
  /**
  * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
  * @param obj1
  * @param obj2
  * @returns obj3 a new object based on obj1 and obj2
  */

  //TODO: make sure we handle edge cases better, e.g. duplicate values.
  mergeObjects : function(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
  }

};

module.exports = cymine;

},{}],2:[function(require,module,exports){
var cymine = require('./cymine');

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

},{"./cymine":1}]},{},[2]);
