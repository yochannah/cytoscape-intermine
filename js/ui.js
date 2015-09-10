var cymineHtml  = require('./../template/cytomine.html'),
metaFields      = require('./metaFields'),
util            = require('./util'),
cyStyle         = require('./cytoscapeStyle');

ui = function (graph) {
  this.graph = graph;
  var cy,
  display = function(node) {
    targetElem = graph.parentElem.querySelector('nodeDetails'),
    setTitle(node);
    listProperties(node);
  },
  setTitle = function (node) {
    var title = graph.parentElem.querySelector('.nodeTitle');
    title.innerHTML = node.label;
  },
  listProperties = function(node) {
    var display = expandPropertyVals(node),
    oldNodeInfo = graph.parentElem.querySelector('.nodeInfo');
    display.setAttribute('class', 'nodeInfo');
    oldNodeInfo.parentElement.replaceChild(display, oldNodeInfo);
  },
  getTemplate = function(){
    return cymineHtml;
  },
  expandPropertyVals = function(obj) {
    var display = document.createElement('dl'),
    dtTemp, ddTemp;
    for (var prop in obj) {
      dtTemp = document.createElement("dt");
      dtTemp.appendChild(document.createTextNode(prop));
      ddTemp = document.createElement("dd");
      if(typeof obj[prop] === "object") {
        ddTemp.setAttribute("class","child");
        ddTemp.appendChild(expandPropertyVals(obj[prop]));
      } else {
        ddTemp.appendChild(document.createTextNode(obj[prop]));
      }
      display.appendChild(dtTemp);
      display.appendChild(ddTemp);
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
    return cy;
  },
  controls = function() {
    var hiddenElems,
    getControls = function() {
      return graph.parentElem.querySelector('.interactionFilter');
    },
    getReset = function(){
      return graph.parentElem.querySelector('.reset');
    },
    selectInteractionType = function(e){
      var elem = e.target;
      if((elem !== e.currentTarget) && (elem.nodeName.toLowerCase() === "button")) {
        //visual button response
        removeAllButtonSelections();
        var elemClass = elem.className;//at this point we've stripped selected off. Should only be the type.
        util.addClass(elem, 'selected');

        //affect the graph:
        //old ones back:
        if(hiddenElems) {
          hiddenElems.restore();
        }
        //we have elemClass, and want to keep them, but hide the others.
        //new ones gone:
        hiddenElems = cy.elements().filterFn(function(ele){
          if(elemClass === "default") {
            return !ele;
          }
          return (!ele.hasClass(elemClass) && !ele.hasClass("both") && !ele.hasClass("master"));
        }).remove();
      }
    },
    resetGraph = function(){
      cy.makeLayout({name: 'cose'}).run();
      getControls().querySelector('.default').click();
    },
    listen = function() {
      getControls().addEventListener('click', selectInteractionType, false);
      getReset().addEventListener('click',resetGraph, false);
    },
    removeAllButtonSelections = function() {
      var theButtons = getControls().querySelectorAll('button');
      for (var i = 0; i < theButtons.length; i++) {
        util.removeClass(theButtons[i], ' selected');
        util.removeClass(theButtons[i], 'selected');
      }
    };
    return {listen : listen};
  },
  initHtml = function () {
    graph.parentElem.innerHTML = getTemplate();
    util.addClass(graph.parentElem, "cymine");
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
      elements: graph.data,
      style: cyStyle,

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
