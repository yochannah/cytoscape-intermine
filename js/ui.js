var cymineHtml = require('./../template/cytomine.html'),
ui = function (graph) {
  this.graph = graph;
  var display = function(node) {
    targetElem = graph.parentElem.querySelector('nodeDetails'),
    setTitle(node);
    listProperties(node);
  },
  setTitle = function (node) {
    var title = graph.parentElem.querySelector('.nodeTitle');
    title.innerHTML = node.label;
  },
  listProperties = function(node) {
    //todo: make this more sane. bold tags and inline html, not so brainy
    var display = expandPropertyVals(node);
    graph.parentElem.querySelector('.nodeInfo').innerHTML = display;
  },
  addProperty = function(prop, key) {
    return '<dt> ' + key + '</dt><dd>' + prop[key] + "</dd>";
  },
  getTemplate = function(){
    return cymineHtml;
  },
  expandPropertyVals = function(obj) {
    var display = "";
    for (var prop in obj) {
      if(typeof obj[prop] === "object") {
        display = "<dt>" + prop + "</dt><dd class='child'><dl>" + expandPropertyVals(obj[prop]) + "</dl></dd>" + display;
      } else{
        display = addProperty(obj, prop) + display;
      }
    }
    return display;
  },
  init = function(errorMessage) {
    initHtml();
    if(!errorMessage) {
      initGraph();
    } else {
      noResults(errorMessage);
    }
  },
  initHtml = function () {
    graph.parentElem.innerHTML = getTemplate();
    graph.parentElem.className += " cymine";
    graph.statusBar = graph.parentElem.querySelector('.status');
  },
  initGraph = function() {
    graph.targetElem = graph.parentElem.querySelector('.cy');

    cy = cytoscape({
      container: graph.targetElem,
      layout: { name: 'cose'},
      style: cytoscape.stylesheet()
  .selector('node')
    .css({
      'content': 'data(label)'
    })
  .selector(':selected')
    .css({
      'background-color': 'black',
      'line-color': 'black',
      'target-arrow-color': 'black',
      'source-arrow-color': 'black',
      'text-outline-color': 'black'
    }),
      elements: graph.data,
      ready: function(){
        window.cy = this;
        graph.statusBar.remove();
      }
    });

    cy.on('tap', 'node', function(){
      display(this.data());
    });

  },
  noResults = function (message) {
    graph.statusBar.className = "status no-results";
    graph.statusBar.innerHTML = message;
  }

  return {
    init:init,
    noResults:noResults
  }

};

module.exports = ui;
