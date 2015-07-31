var nodeInfo = {
  display : function(node) {
    this.targetElem = document.getElementById('nodeDetails'),
    console.log(node);
    this.node = node;
    this.setTitle();
    this.listProperties();
  },
  setTitle : function () {
    var title = nodeInfo.targetElem.querySelector('.nodeTitle');
    title.innerHTML = this.node.label;
  },
  listProperties : function() {
    //todo: make this more sane. bold tags and inline html, not so brainy
    var display = this.expandPropertyVals(this.node);
    nodeInfo.targetElem.querySelector('.nodeInfo').innerHTML = display;
  },
  addProperty : function(prop, key) {
    return '<dt> ' + key + '</dt><dd>' + prop[key] + "</dd>";
  },
  expandPropertyVals : function(obj) {
    var display = "";
    for (var prop in obj) {
      if(typeof obj[prop] === "object") {
        display = "<dt>" + prop + "</dt><dd class='child'><dl>" + this.expandPropertyVals(obj[prop]) + "</dl></dd>" + display;
      } else{
        display = this.addProperty(obj, prop) + display;
      }
    }
    return display;
  }
};

module.exports = nodeInfo;
