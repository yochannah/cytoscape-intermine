var _ = require('underscore'),
Cymine = function(records) {
  this.records = records;
  function toNodesAndEdges(records, parentNode){
    var d = {
      nodes : [],
      edges : []
    };

    for (var i in records) {
      var thisNode, row = records[i];
      thisNode = recordToNode(row);

      if(row.interactions) {
        //recursively make the interactions into nodes,
        //because node entities are nested at two levels.
        d = _.extend(d, toNodesAndEdges(row.interactions, thisNode));
      } else {
        //if it doesn't have an interaction list, it probably *is* an interaction
        //and thus needs to be an edge
        d.edges = d.edges.concat(interactionToEdges(parentNode, thisNode));
      }
      d.nodes.push(thisNode);
    }

    return d;
  };
  var recordToNode = function (obj) {
    var ret, data = {}, interactions;
    ret = obj.gene2 ? obj.gene2 : obj;
    interactions = getInteractions(obj);
    return {
      classes : getClasses(interactions),
      data : {
        details : getDetails(obj),
        label   : nameNode(obj),
        class   : ret.class,
        interactionTypes : interactions,
        symbol  : ret.symbol,
        id : ret.primaryIdentifier //cytoscape needs strings, not ints
      }
    }
  },
  getClasses = function(arrOfClasses){
    var ret = _.uniq(arrOfClasses); //clones the node
    if(ret.length > 1) {
      ret.push("both");
    }
    return ret.join(" ");
  }
  getDetails = function(obj) {
    var details = obj.details ? obj.details[0] : {};
    details = collapseArrays(details);
    return details;
  },
  /**
   * While it's usefuly to see array indices if there are multiple elements,
   * There's not much point showing an index for just one array element.
   * This function collapses arrays with only one member and returns the member instead.
   * @param  {object} obj an object with arrays in its properties. Can be nested.
   * @return {object} the same object, just with 1-length arrays collapsed.
   */
  collapseArrays = function(obj){
    var ret = obj;
    for (var detail in ret){
      var theProp = ret[detail];
      if(Array.isArray(theProp)) {
        ret[detail] = (theProp.length === 1) ? theProp[0] : theProp;
      } else if(typeof theProp === "object") {
        theProp = collapseArrays(theProp);
      } // no need for a final else. Just leave string/int values as is.
    }
    return ret;
  },
  getInteractions = function(obj){
    var ret = [];
    if (obj.details) {
      for (var i = 0; i < obj.details.length; i++) {
        ret.push(obj.details[i].type);
      }
    } else {
      ret.push("master");
    }
    return ret;
  },
  nameNode = function(obj) {
    if (obj.gene2 && obj.gene2.symbol) {
      return obj.gene2.symbol;
    } else if (obj.symbol) {
      return obj.symbol;
    } else if (obj.details) {
      return obj.details[0].name;
    } else {
      return "NAME MISSING";
    }
  },
  interactionToEdges = function(node, node2) {
    var interactions = node2.data.interactionTypes,
    ret = [];
    for(var i = 0; i < interactions.length; i++) {
      ret.push({
        id : node2.data.details.objectId,
        classes : interactions[i],
        data : {
          description: "From " + node.data.label + " to " + node2.data.label,
          source : node.data.id,
          target : node2.data.id,
          interactionType : interactions[i]
        }
      });
    }
    return ret;
  }
  return toNodesAndEdges(records);
};

module.exports = Cymine;
