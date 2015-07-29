var cymine = {
  toNodesAndEdges : function(records, parentNode){
    var d = {
      nodes : [],
      edges : []
    };

    for (var i in records) {
      var thisNode, row = records[i];
      thisNode = this.recordToNode(row);

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
        label : this.nameNode(obj),
        symbol : ret.symbol,
        id : ret.objectId.toString() //cytoscape needs strings
      }
    }
  },
  nameNode : function(obj) {
    if (obj.gene2 && obj.gene2.symbol) {
      return obj.gene2.symbol;
    } else if (obj.symbol) {
      return obj.symbol;
    } else if (obj.details) {
      return obj.details[0].name;
    } else {
      return "NAME MISSING"
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
