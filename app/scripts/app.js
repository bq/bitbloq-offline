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
        'pascalprecht.translate',
        'angular-clipboard'
    ]).config(['$routeProvider', '$translateProvider',
        function($routeProvider, $translateProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/bloqs-project.html'
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
            // $translateProvider.fallbackLanguage('en-GB');
        }

    ])
    .run(function(_, bloqs, bloqsUtils, bloqsLanguages, nodeRemote, nodeDialog, nodeFs) {
        // Make sure _ is invoked at runtime. This does nothing but force the "_" to
        // be loaded after bootstrap. This is done so the "_" factory has a chance to
        // "erase" the global reference to the lodash library.
        bloqs.setOptions({
            fieldOffsetLeft: 48,
            fieldOffsetTopForced: 41
        });

        console.log('Start Bitbloq Offline');
        // console.log(process);

    });