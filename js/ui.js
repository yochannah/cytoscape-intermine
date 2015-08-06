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
  controls = function() {
    var getControls = function() {
      return graph.parentElem.querySelector('.controls');
    },
    selectInteractionType = function(e){
      var elem = e.target;
      if((elem !== e.currentTarget) && (elem.nodeName.toLowerCase() === "button")) {
        //visual button response
        removeAllButtonSelections();
        addClass(elem, 'selected');

        //affect the graph:
        //TODO:pre-req: edges need to have classes!
      }
    },
    listen = function() {
      getControls().addEventListener('click', selectInteractionType, false);
    },
    addClass = function(elem, classToAdd) {
      if (!hasClass(elem, classToAdd)) {
        elem.className += " " + classToAdd;
      }
    },
    removeClass = function(elem, classToRemove) {
      elem.className = elem.className.replace(classToRemove, "");
    },
    removeAllButtonSelections = function() {
      var theButtons = getControls().querySelectorAll('button');
      for (var i = 0; i < theButtons.length; i++) {
        removeClass(theButtons[i], 'selected');
      }
    }
    hasClass = function(elem, classToCheckFor) {
      var classes = elem.className.split(" ");
      return (classes.indexOf(classToCheckFor) >= 0);
    }
    return {listen : listen};
  },
  initHtml = function () {
    graph.parentElem.innerHTML = getTemplate();
    graph.parentElem.className += " cymine";
    graph.statusBar = graph.parentElem.querySelector('.status');
  },
  initGraph = function() {
    graph.targetElem = graph.parentElem.querySelector('.cy');
    try{
      var interactionControls = controls();
      interactionControls.listen();
    } catch(e) {
      console.error(e);
    }
    //make the graph
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
    })
    .selector('edge')
      .css({ 'width': '2px' })
    .selector('edge[interactionType @= "genetic"]')
      .css({ 'line-color': '#2c79be' })
    .selector('edge[interactionType @= "physical"]')
      .css({ 'line-color': 'red' }),
          elements: graph.data,
      ready: function(){
        window.cy = this;
        graph.statusBar.remove();
      }
    });

    //event listener for node taps
    cy.on('tap', 'node', function(){
      display(this.data());
    });

    cy.on('tap', 'edge', function(){
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
