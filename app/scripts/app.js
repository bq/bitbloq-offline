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
    ]).config(['$routeProvider', '$translateProvider', '$sceProvider',
        function($routeProvider, $translateProvider, $sceProvider) {
            $routeProvider
                .when('/', {
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
            //its safe here
            //console.log($sceProvider.enabled(false));
        }

    ])
    .run(function(_, bloqs, bloqsUtils, bloqsLanguages, nodeRemote, nodeDialog, nodeFs) {
        console.log('Start Bitbloq Offline');
        // console.log(process);
    });