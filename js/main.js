var cymineDataFormatter = require('./dataFormatter'),
  imjs = require('imjs'),
  cytoscape = require('../bower_components/cytoscape/dist/cytoscape.js'),
  _ = require('underscore'),
  strings = require('./strings'),
  query = require('./query/query'),
  proteinConstraint = require('./query/proteinPhysicalConstraint'),
  exportFile = require('./exporter/exporter'),
  tableDisplayer = require('./showInTable')(),
  Promise = require('es6-promise').Promise,
  cymineDisplay = require('./ui');

function Cymine(args) {

  var ui,
    graph = _.extend({}, args),
    exporter = exportFile();
  cym = init();

  /**
   * Checks if there is indeed an element to attach to, and failing that tries a default.
   * @return {boolean} whether or not we've found an element to attach to.
   *                   Allows you to cancel the xhr
   *                   since there's nowhere to render it to.
   */
  function validateParent() {
    if (!graph.parentElem) {
      var defaultElem = document.getElementById('cymine');
      if (defaultElem) {
        graph.parentElem = defaultElem;
        console.info(strings.dev.noParent.usingDefault);
      } else {
        console.error(strings.dev.noParent.noDefault);
        return false;
      }
    }
    return true;
  }

  function validateServiceRoot() {
    if (graph.service) {
      return new imjs.Service({
        token: graph.service.token,
        root: graph.service.root,
        errorHandler: badServiceError
      });
    } else {
      throw new initError('noServiceUrl');
    }

  }

  function prepQuery() {
    if (graph.queryOn) {
      _.extend(query.where[0], graph.queryOn);
      graph.query = query;

      if (graph.nodeType === strings.CONST.PROTEIN) {
        prepProteinQuery();
      }

      return true;
    } else {
      throw new initError('noQueryData');
    }
  }

  //protein interactions are just gene interactions for the gene associated
  //with the given protein, but we only want to see the physical ones. So,
  //It's the same query with a tiny bit of tweaking.
  function prepProteinQuery() {
    graph.query.where[0].path = strings.CONST.LOOKUP_PROTEIN;
    //objectId searches are structured differently from
    //lookups.
    if (graph.query.where[0].op === "=") {
      graph.query.where[0].path += ".id";
    }
    //add a constraint to restrict to physical interactions,
    //but only if it's not there already.
    if (graph.query.where.length <= 1) {
      graph.query.where.push(proteinConstraint);
    }
  }

  function init() {
    var promise = new Promise(function(resolve, reject) {
      if (validateParent()) {
        //add the elements to the page
        ui = new cymineDisplay(graph);
        ui.init();

        //check that the service and query looks ok, or error if not.
        mine = validateServiceRoot();

        if (prepQuery() && mine) {
          //get the data from the mine
          var q = mine.records(query).then(function(response) {
            if (response.length > 0) {
              //store the raw response. Other files use it, e.g. the exporter.
              graph.rawData = response;

              //transform the data into a shape cytoscape can use.
              graph.data = new cymineDataFormatter(response);

              //Add cytoscape graph
              graph.cy = ui.attachResults();

              //init the export functions and their UI listeners
              try {
                exporter.init(graph);
              } catch (e) {
                console.error(e);
              }

              //init the table display
              try {
                tableDisplayer.init(graph);
              } catch (e) {
                console.error(e);
              }

              console.debug('response:', response, 'graphdata:', graph);
              resolve(graph);
            } else {
              //this tells the user the response was empty for this gene.
              //No interactions data available.
              ui.attachResults(strings.user.noResults);
            }
          }).catch(function(error) {
            console.error("Communication error: ", error);
            ui.attachResults(strings.user.pleaseClearCache);
            reject();
          });
        }
      } else {
        reject('bad query');
      }
    });
    return promise;
  }
  /**
   * throw this error to console.error and display a user-facing error too
   * @param  {string} devMessage  this should be the key to a string in the strings.dev object.
   * @param  {string} userMessage optional - this should be the key to a string
   *                  in the strings.user object. If not set, it will use the
   *                  generic strings.user.noQuery message.
   */
  function initError(devMessage, userMessage) {
    var um = userMessage ? userMessage : "noQueryData";
    ui.init(strings.user[um]);
    console.error(strings.dev[devMessage]);
  }
  return cym;
}
/**
 * helper method for calling services from imjs. Useful because we can only pass a reference to a functtion (without args) to imjs, so passing initError wouldn't allow us to set the dev error message.
 */
function badServiceError() {
  throw new initError('badServiceUrl');
}

module.exports = Cymine;
