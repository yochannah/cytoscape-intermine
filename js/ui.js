var cymineHtml = require('./../template/cytomine.html'),
metaFields =require('./metaFields'),
cyStyle = require('./cytoscapeStyle');
ui = function (graph) {
  this.graph = graph;
  var cy,
  display = function(node) {
    targetElem = graph.parentElem.querySelector('nodeDetails'),
    setTitle(node);
    listProperties(node);
  },
  setTitle = function (elem) {
    var title = graph.parentElem.querySelector('.nodeTitle');
    title.innerHTML = elem.title;
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
      if(metaFields.indexOf(prop) < 0) { //users never want to see objectId.
        dtTemp = document.createElement("dt");
        dtTemp.appendChild(document.createTextNode(prop));
        ddTemp = document.createElement("dd");
        util.addClass(ddTemp, prop);
        if(typeof obj[prop] === "object") {
          util.addClass(ddTemp, "child");
          ddTemp.appendChild(expandPropertyVals(obj[prop]));
        } else {
          ddTemp.appendChild(document.createTextNode(obj[prop]));
        }
        insertAtStart([dtTemp, ddTemp], display);
//        display.appendChild(dtTemp);
//        display.appendChild(ddTemp);
      }
    }
    return display;
  },
  insertAtStart = function(elems, parentContainer) {
    var firstOriginalElem = parentContainer.firstChild;
    for (var i = 0; i < elems.length; i++) {
      parentContainer.insertBefore(elems[i],firstOriginalElem);
    }
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
        util.addClass(elem, 'selected');
        //affect the graph:
        //old ones back:
        if(hiddenElems) {
          hiddenElems.restore();
        }
        //new ones gone:
        hiddenElems = cy.elements('.' + elemClass + '').filterFn(function(ele){
          return !ele.hasClass("both");
        }).remove();
      }
    },
    listen = function() {
      getControls().addEventListener('click', selectInteractionType, false);
    },
    removeAllButtonSelections = function() {
      var theButtons = getControls().querySelectorAll('button');
      for (var i = 0; i < theButtons.length; i++) {
        util.removeClass(theButtons[i], ' selected');
        util.removeClass(theButtons[i], 'selected');
      }
    }
    return {listen : listen};
  },
  util = {
    addClass : function(elem, classToAdd) {
      if (!util.hasClass(elem, classToAdd)) {
        elem.className += " " + classToAdd;
      }
    },
    removeClass : function(elem, classToRemove) {
      elem.className = elem.className.replace(classToRemove, "");
    },
    hasClass : function(elem, classToCheckFor) {
      var classes = elem.className.split(" ");
      return (classes.indexOf(classToCheckFor) >= 0);
    }
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
