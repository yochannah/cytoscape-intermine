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
      return loadView
    });

    chan.bind('style', function (trans, params) {

      var head = document.getElementsByTagName("head")[0];
      var link = document.createElement('link');

      link.rel = "stylesheet";
      link.href = params.stylesheet;

      head.appendChild(link);

    });

    function initGraph (params) {
      var serviceArgs = params.service;
      serviceArgs.errorHandler = function(error){
        console.error('Communication error!\n', error);
      }
      console.log(params);
      cymine({
        parentElem : document.getElementById('staircaseCymine'),
        service : params.service,
        queryOn : {
          value: params.id,
          op : "=",
          path : "id"
        }
      });
    }

    function wants (message) {
      chan.notify({
        method: 'wants',
        params: message
      });
    }

    function nextStep (data) {
      chan.notify({
        method: 'next-step',
        params: data
      });
    }
});
