var nodePath = '../node_modules/';
require.config({
    paths: {
        jschannel: nodePath + 'jschannel/src/jschannel',
        imjs:  nodePath + 'imjs/js/3.14.0/im'
    },
    shim: {
        jschannel: {
          exports: 'Channel'
        }
    }
});

require([
    'imjs',
    'jschannel'
  ], function (imjs, Channel) {

    'use strict';

    var chan = Channel.build({
      window: window.parent,
      origin: '*',
      scope: 'CurrentStep'
    });

    var activeTabs = null;

    chan.bind('configure', function (trans, params) {
      activeTabs = params.activeTabs;
      return 'ok';
    });

    chan.bind('init', function (trans, params) {
      var loadView, rootNode = document.body;
      //TODO the graphy thing here
      console.log('%cthis worked','color:seagreen');
      if (params.item) {
        //TODO the graphy thing here
        console.log('%cthis worked too','color:hotpink');
        loadView = initList(params); //TODO
      } else {
        console.log('%cthis worked too','color:deepskyblue;font-weight:bold;');
        console.error("Unknown message", params);
        trans.error('Could not interpret message');
      }
      loadView.then(function (view) {
        trans.complete('ok');
      }, function (error) {
        console.error('Failed to initialise view', error);
        trans.error('not ok');
      });
      trans.delayReturn(true);
    });

    chan.bind('style', function (trans, params) {

      var head = document.getElementsByTagName("head")[0];
      var link = document.createElement('link');

      link.rel = "stylesheet";
      link.href = params.stylesheet;

      head.appendChild(link);

    });

    function initList (params) {
      //TODO This is where the magic happens
      var listName = params.listName;
      var serviceArgs = params.service;
      serviceArgs.errorHandler = function(error){
        console.error('Communication error!\n', error);
      }
      var service = imjs.Service.connect(serviceArgs);

      return service.fetchList(listName).then(function showList (list) {

        //snipped most of the stuff out, but here's how we notify stuff if there
        //are next steps. Perhaps a list?

        chan.notify({
          method: 'has-list',
          params: {
            root: service.root,
            name: list.name,
            type: list.type
          }
        });

        list.contents().then(function (objs) {
          var ids = objs.map(function (o) { return o.objectId; });
          reportItems(service, list.type, list.type, ids, ['available']);
        });
      });
    }

    //TODO: inspect and remove when needed,
    function initItem (params) {

      var type = params.item.type; // eg: "Gene"
      var fields = params.item.fields; // eg: {'organism.taxonId': 7227, primaryIdentifier: 'FBGN000123'}
      var serviceArgs = params.service;
      var service = imjs.Service.connect(serviceArgs);

      var query = {
        from: type,
        select: ['id'],
        where: fields
      };

      return service.records(query).then(function (objects) {
        var object = objects[0];
        var path = type; // here the path is the same as the type.
        var view = ObjectView.create({
          service: service,
          object: {id: object.objectId, type: object['class']}
        });
        reportItems(service, path, type, [object.objectId], ['available']);
        return view;
      });
    }

    function wants (message) {
      chan.notify({
        method: 'wants',
        params: message
      });
    }

    function executeQuery (root, title, query) {
      nextStep({
        title: 'ran ' + title,
        tool: 'show-table',
        data: {
          query: query,
          service: { root: root }
        }
      });
    }

    function nextStep (data) {
      chan.notify({
        method: 'next-step',
        params: data
      });
    }

    function reportItems (service, path, type, ids, categories) {
        chan.notify(makeItems(service, path, type, ids, categories));
        chan.notify(makeItems(service, path, type, ids, categories, true));
    }

});

/**
 * Prepare data for a 'has' item/items jschannel notification.
 * @param  {boolean} singleItem set to true if returning only a single item, not an array of items.
 * @return {jschannel notification object} notification object containing the data to be passed to other tools in steps.
 */
function makeItems(service, path, type, ids, categories, singleItem) {

  var what = 'items',
  theIds = ids;
  if (!categories) {
    categories = ['selected'];
  }

  if(singleItem) {
    what = 'item';
    theIds = (ids.length === 1) ? ids[0]: [];
  }

  var data = null;

  if (theIds && theIds.length > 0) {
    data = {
      key: (categories.join(',') + '-' + path), // String - any identifier.
      type: type, // String - eg: "Protein"
      categories: categories, // Array[string] - eg: ['selected']
      id: theIds,  // Array[Int] - eg: [123, 456, 789]
      service: service
    }
  }

  return {
    method: 'has',
    params: {
      what: what,
      data: data
    }
  };
}
