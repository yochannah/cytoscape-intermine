var cymineDataFormatter = require('./dataFormatter'),
imjs          = require('./../bower_components/imjs/js/im.js'),
cytoscape     = require('cytoscape'),
_             = require('underscore'),
strings       = require('./strings'),
query         = require('./query'),
cymineDisplay = require('./ui');

function Cymine(args) {

  var ui,
  graph = _.extend({},args);
  init();

/**
 * Checks if there is indeed an element to attach to, and failing that tries a default.
 * @return {boolean} whether or not we've found an element to attach to. Allows you to cancel the xhr
 *                          since there's nowhere to render it to.
 */
  function validateParent() {
    if(!graph.parentElem){
      var defaultElem = document.getElementById('cymine');
      if(defaultElem) {
        graph.parentElem = defaultElem;
        console.info(strings.dev.noParent.usingDefault);
      } else {
        console.error(strings.dev.noParent.noDefault);
        return false;
      }
    }
    return true;
  }
  function validateServiceRoot(){
    if(graph.serviceUrl){
      return new imjs.Service({
        root: graph.serviceUrl,
        errorHandler : badServiceError
      });
    } else {
      throw new initError('noServiceUrl');
      return false;
    }

  }
  function prepQuery() {
    if(graph.queryOn) {
      _.extend(query.where[0],graph.queryOn);
      return true;
    } else {
      throw new initError('noQueryData');
      return false;
    }
  }
  function init(){
    if(validateParent()) {
      ui = new cymineDisplay(graph);
      var mine = validateServiceRoot();
      if(prepQuery() && mine) {
        mine.records(query).then(function(response) {
          if (response.length > 0) {
            graph.data = new cymineDataFormatter(response);
            ui.init();
            console.debug('response:', response, 'graphdata:', graph);
          } else {
            ui.init(strings.user.noResults);
          }
        });
      }
    }
  }
  /**
   * throw this error to console.error and display a user-facing error too
   * @param  {string} devMessage  this should be the key to a string in the strings.dev object.
   * @param  {[type]} userMessage optional - this should be the key to a string in the strings.user object. If not set, it will use the generic strings.user.noQuery message.
   */
  function initError(devMessage, userMessage){
    var um = userMessage ? userMessage : "noQueryData";
    ui.init(strings.user[um]);
    console.error(strings.dev[devMessage]);
  }
}
/**
 * helper method for calling services from imjs. Useful because we can only pass a reference to a functtion (without args) to imjs, so passing initError wouldn't allow us to set the dev error message.
 * @return {[type]} [description]
 */
function badServiceError(){
    throw new initError('badServiceUrl');
}

module.exports = Cymine;
