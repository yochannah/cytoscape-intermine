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
    return '<b> ' + key + '</b>: ' + prop[key] + "<br />";
  },
  expandPropertyVals : function(obj) {
    var display = "";
    for (var prop in obj) {
      if(typeof obj[prop] === "object") {
        display += this.addProperty(this.expandPropertyVals(obj[prop]), prop);
        console.log('object:', obj[prop], 'prop:', prop);
      } else{
        display += this.addProperty(obj, prop);
      }
    }
    return display;
  }
};

module.exports = nodeInfo;
