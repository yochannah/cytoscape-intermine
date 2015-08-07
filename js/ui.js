var cymineHtml = require('./../template/cytomine.html'),
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
    //todo: make this more sane. bold tags and inline html, not so brainy
    var display = expandPropertyVals(node),
    oldNodeInfo = graph.parentElem.querySelector('.nodeInfo');
    console.log('display', display);
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
      display.appendChild(dtTemp);
      ddTemp = document.createElement("dd");
      ddTemp.setAttribute("class","child");
      if(typeof obj[prop] === "object") {
        ddTemp.appendChild(expandPropertyVals(obj[prop]));
      } else {
        ddTemp.appendChild(document.createTextNode(obj[prop]));
      }
      display.appendChild(ddTemp);
    }
    console.log('deeper',display);
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
    var hiddenElems,
    getControls = function() {
      return graph.parentElem.querySelector('.controls');
    },
    selectInteractionType = function(e){
      var elem = e.target;
      if((elem !== e.currentTarget) && (elem.nodeName.toLowerCase() === "button")) {
        //visual button response
        removeAllButtonSelections();
        var elemClass = elem.className;//at this point we've stripped selected off. Should only be the type.
        addClass(elem, 'selected');

        //affect the graph:
        //old ones back:
        if(hiddenElems) {
          hiddenElems.restore();
        }
        //new ones gone:
        hiddenElems = cy.elements('[interactionType="' + elemClass + '"]').remove();
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
        removeClass(theButtons[i], ' selected');
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
      'line-color': 'gold',
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
