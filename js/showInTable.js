var util = require('./util'),
  strings = require('./strings').showTable;

var table = function() {
  //check for IMtables and load it if it's not present.
  //it'll hopefully be embedded in intermine already, but it's huge so makes
  //sense not to bundle it when it's probably already present.
  var settings, elems = {},
    imtablesSettings;
  var init = function(graph) {
      var timeoutID = setTimeout(function() {
        if (typeof imtables !== "undefined") {
          settings = graph;
          showTableButton();

          imtablesSettings = {
            query: settings.query,
            service: {
              root: settings.service.root
            }
          }
        };
      }, 500); //provides a bit of extra time to make sure the script is downloaded.
      //may not be necessary or may need to be longer.
    },
    //technically this method should probably be called showShowTableButton,
    //but there's no need to be ridiculous.
    showTableButton = function() {
      elems.showTable = settings.parentElem.querySelector('.showTable');
      util.addClass(elems.showTable, "enabled");
      elems.showTable.innerHTML = strings.showInTableFormat;

      //listen for show/hide clicks
      listen();
    },
    showTable = function() {
      //get the element
      elems.theTable = settings.parentElem.querySelector('.tableView');

      //set the button text
      elems.showTable.innerHTML = strings.hideTableFormat;

      //remove the 'disabled' class. This displays the table.
      util.removeClass(elems.theTable, "disabled");

      //if we've never loaded the table before, we'll need to
      //get the results, ajaxily.
      if (util.hasClass(elems.theTable, "firstRun")) {
        imtables.loadTable(
          elems.theTable, {
            "start": 0,
            "size": 25
          }, {
            query: settings.query,
            service: {
              root: settings.service.root
            }
          }).then(
          function(table) {
            console.log('Table loaded', table);
          },
          function(error) {
            console.error('Could not load table', error);
          });
        //awesome. We'll never want to ajax-get the results again,
        //so we'll remove the class that made it happen.
        util.removeClass(elems.theTable, 'firstRun');
      }
    },
    hideTable = function() {
      util.addClass(elems.theTable, "disabled");
      elems.showTable.innerHTML = strings.showInTableFormat;
    },
    listen = function() {
      elems.showTable.addEventListener('click', function() {
        //elems.theTable is null before the first run
        //which would throw an error if we only used the disabled test.
        if (!elems.theTable || util.hasClass(elems.theTable, 'disabled')) {
          showTable();
        } else {
          hideTable();
        }
      });
    };
  return {
    showTable: showTable,
    init: init
  };
};
module.exports = table;
