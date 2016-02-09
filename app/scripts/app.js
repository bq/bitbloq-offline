'use strict';

/**
 * @ngdoc overview
 * @name bitbloqOffline
 * @description
 * # bitbloq-offline
 *
 * Main module of the application.
 */
angular
  .module('bitbloqOffline', [
    'ngRoute',
    'ngWebSocket',
    'angular-clipboard'
  ]).config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/landing.html',
          controller: 'LandingCtrl'
        })
        .when('/bloqsproject/', {
          templateUrl: 'views/bloqs-project.html'
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  ])
  .run(function(_, bloqs, bloqsUtils, bloqsLanguages) {
    // Make sure _ is invoked at runtime. This does nothing but force the "_" to
    // be loaded after bootstrap. This is done so the "_" factory has a chance to
    // "erase" the global reference to the lodash library.
    bloqs.setOptions({
      fieldOffsetLeft: 0,
      fieldOffsetTopSource: []
    });
    window.$ = window.JQuery = require('jquery');
    console.log('Start Bitbloq Offline');
    // console.log(process);
  })
