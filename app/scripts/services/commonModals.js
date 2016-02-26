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

    exports.launchNotSavedModal = function(callback) {
      var confirmAction = function() {
          notSavedModal.close();
          callback(true);
        },
        rejectAction = function() {
          notSavedModal.close();
          callback(false);
        };


      var modalOptions = $rootScope.$new();
      _.extend(modalOptions, {
        title: 'save',
        confirmButton: 'modal-exit-save',
        rejectButton: 'modal-exit-exit',
        confirmAction: confirmAction,
        rejectAction: rejectAction,
        contentTemplate: 'file://' + __dirname + '/views/modals/text.html',
        modalButtons: true,
        save: true
      });

      var notSavedModal = ngDialog.open({
        template: 'file://' + __dirname + '/views/modals/modal.html',
        className: 'modal--container modal--input',
        scope: modalOptions,
        showClose: false
      });
    };

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
          name: oldLanguage,
          items: [{
            name: 'es-ES'
          }, {
            name: 'en-GB'
          }, {
            name: 'nl-NL'
          }, {
            name: 'ru-RU'
          }, {
            name: 'it-IT'
          }, {
            name: 'eu-ES'
          }, {
            name: 'ca-ES'
          }, {
            name: 'fr-FR'
          }, {
            name: 'de-DE'
          }, {
            name: 'pt-PT'
          }, {
            name: 'gl'
          }, {
            name: 'zh-CN'
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
