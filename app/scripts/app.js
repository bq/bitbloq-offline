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
        'ngSanitize',
        'ngWebSocket',
        'pascalprecht.translate',
        'angular-clipboard',
        'ngDialog',
        'nvd3'
    ]).config(['$routeProvider', '$translateProvider',
        function($routeProvider, $translateProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/python-bloqs-project.html'
                })
                .when('/arduino', {
                    templateUrl: 'views/bloqs-project.html'
                })
                .when('/plotter/:port/:board', {
                    templateUrl: 'views/plotter.html',
                    controller: 'PlotterCtrl',
                    islogin: true
                })
                .otherwise({
                    redirectTo: '/'
                });
            $translateProvider.useStaticFilesLoader({
                prefix: 'res/locales/',
                suffix: '.json'
            });

            //indicamos el idioma inicial
            $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
            $translateProvider.preferredLanguage('es-ES');
            $translateProvider.fallbackLanguage('es-ES');
        }

    ])
    .run(function(_, bloqs, bloqsUtils, bloqsLanguages, nodeRemote, nodeDialog, nodeFs) {
        // Make sure _ is invoked at runtime. This does nothing but force the "_" to
        // be loaded after bootstrap. This is done so the "_" factory has a chance to
        // "erase" the global reference to the lodash library.


        console.log('Start Bitbloq Offline');
        // console.log(process);
    });