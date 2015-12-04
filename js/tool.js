var nodePath = '../node_modules/';
require.config({
    paths: {
        jschannel: nodePath + 'jschannel/src/jschannel'
    },
    shim: {
        jschannel: {
          exports: 'Channel'
        }
    }
});

require([
    'jschannel'
  ], function (Channel) {

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
      var loadView;
      if (params.service) {
        loadView = initGraph(params);
      } else {
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
      return loadView;
    });

    chan.bind('style', function (trans, params) {

      var head = document.getElementsByTagName("head")[0];
      var link = document.createElement('link');

      link.rel = "stylesheet";
      link.href = params.stylesheet;

      head.appendChild(link);
      trans.complete('ok');
    });

    function chooseInteractor(params){
      return params.id || params.ids[0];
    };

    function initGraph (params) {
      var serviceArgs = params.service;
      serviceArgs.errorHandler = function(error){
        console.error('Communication error!\n', error);
      };
      console.log(params);
      var c = cymine({
        parentElem : document.getElementById('staircaseCymine'),
        service : params.service,
        queryOn : {
          value: chooseInteractor(params),
          op : "=",
          path : "id"
        }
      }).then(function(response){
        //emit data for tools later on.
        var dataOut = prepareDataOut(response.rawData),
        path = params.type || params.item.type;
        reportItems(params.service, path, path, dataOut)
      });
    }

    function prepareDataOut(data){
      var out = [], participant2;
      data = data[0];

      //add master node
      out.push(data.objectId);

      //add child interactor nodes
      for (var i = 0; i < data.interactions.length; i++) {
        participant2 = data.interactions[i].participant2;
        out.push(participant2.objectId);
      }
      return out;
    }

function reportItems(service, path, type, ids, categories, what) {
  if (!categories) {
    categories = ['selected'];
  }
  if (!what) {
    what = 'ids';
  }
  chan.notify({
    method: 'has',
    params: {
      what: what,
      data: {
        key: (categories.join(',') + '-' + path), // String - any identifier.
        type: type, // String - eg: "Protein"
        categories: categories, // Array[string] - eg: ['selected']
        ids: ids, // Array[Int] - eg: [123, 456, 789]
        service: {
          root: service.root
        }
      }
    }
  });
}

});
