'use strict';

/**
 * @ngdoc service
 * @name bitbloqOffline.commonModals
 * @description
 * # commonModals
 * Service in the bitbloqOffline.
 */
angular.module('bitbloqOffline')
  .service('commonModals', function($rootScope, $translate, _, ngDialog) {

    var exports = {};

    exports.launchChangeLanguageModal = function() {
      var oldLanguage = $translate.use();

      var confirmAction = function() {
          languageModal.close();
          $translate.use(modalOptions.lang);
        },
        translateLanguage = function(language) {
          $translate.use(language);
        },
        rejectAction = function() {
          $translate.use(oldLanguage);
        },
        languageModal,
        modalOptions = $rootScope.$new();

      var languagesOb = {
        languages: {
          name: 'Idiomas',
          items: [{
            name: 'es-ES'
          }, {
            name: 'en-GB'
          }, {
            name: 'it-IT'
          }, {
            name: 'eu-ES'
          }, {
            name: 'ca-ES'
          }, {
            name: 'de-DE'
          }, {
            name: 'gl'
          }, {
            name: 'ru-RU'
          }, {
            name: 'fr-FR'
          }, {
            name: 'zh-CN'
          }, {
            name: 'pt-PT'
          }, {
            name: 'fr-FR'
          }]
        }
      };
      _.extend(modalOptions, {
        title: 'header-change-language',
        confirmButton: 'change-language',
        rejectButton: 'modal-button-cancel',
        confirmAction: confirmAction,
        rejectAction: rejectAction,
        contentTemplate: 'file://' + __dirname + '/views/modals/input.html',
        modalButtons: true,
        modalDropdown: true,
        languages: languagesOb,
        optionsClick: translateLanguage,
        dropdown: {
          options: 'languages',
        },
        translate: function(language) {
          modalOptions.lang = language;
        },
      });

      languageModal = ngDialog.open({
        template: 'file://' + __dirname + '/views/modals/modal.html',
        className: 'modal--container modal--input',
        scope: modalOptions,
        showClose: false
      });
    };

    return exports;
  });