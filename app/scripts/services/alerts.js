/*jshint bitwise: false*/
'use strict';

/**
 * @ngdoc service
 * @name bitbloqApp.alerts
 * @description
 * # Alerts service
 */
angular.module('bitbloqOffline')
  .service('alertsService', function($timeout, _, $rootScope) {
    var exports = {},
      alerts = [],
      alertTimeout,
      i = 0,
      options = {
        maxSimultaneousAlerts: 5
      };

    var _removeAlert = function(propertyName, propertyValue) {
      var removedAlert;

      removedAlert = _.remove(alerts, function(al) {
        return al[propertyName] === propertyValue;
      });

      if (removedAlert.length > 0) {
        // if (alerts.length === 0) {
        //     i = 0;
        // }

        if (!$rootScope.$$phase) {
          $rootScope.$digest();
        }
      }

    };

    exports.isVisible = function(propertyName, propertyValue) {
      return !!_.find(alerts, function(item) {
        return item[propertyName] === propertyValue;
      });
    };

    exports.getInstance = function() {
      if (!alerts) {
        alerts = [];
      }
      return alerts;
    };

    /**
     * [alert create alert message]
     * @param  {[string]} text  [text to show] required;
     * @param  {[string]} type [type of the alert (info, confirm, error, warning)] not required;
     * @param  {[number]} time  [time in ms to close the alert] not required
     * @param  {[string]} id  [Alert id] required
     */
    exports.add = function(text, id, type, time, data, preIcon, postIcon, linkText, link, linkParams, closeFunction, closeParams) {

      i += 1;

      var domClass,
        alert = {
          text: text,
          id: id,
          uid: Date.now(),
          type: type || 'info',
          time: time || 'infinite',
          domClass: domClass,
          preIcon: preIcon || false,
          postIcon: postIcon || false,
          value: data,
          index: i,
          linkText: linkText,
          linkAction: link,
          linkParams: linkParams,
          close: exports.close,
          closeFunction: closeFunction,
          closeParams: closeParams
        };

      switch (type) {
        case 'info':
          domClass = 'alert--info';
          break;
        case 'confirm':
          domClass = 'alert--confirm';
          break;
        case 'error':
          domClass = 'alert--error';
          break;
        case 'warning':
          domClass = 'alert--warning';
          break;
        default:
          domClass = 'alert--info';
      }

      _removeAlert('id', alert.id);

      if (alerts.length === options.maxSimultaneousAlerts) {
        alerts.pop();
      }

      if (alert.time !== 'infinite') {
        alertTimeout = $timeout(function() {
          _removeAlert('uid', alert.uid);
          if (alert.closeFunction) {
            alert.closeFunction(closeParams);
          }
        }, alert.time);
      }

      alerts.unshift(alert);

      if (!$rootScope.$$phase) {
        $rootScope.$digest();
      }

      return alert.uid;

    };

    /**
     * [close description]
     * @param  {[object]} evt  [event triggered when clicking the close button]
     */
    exports.close = function(uid, evt) {
      if (evt) {
        var $element = $(evt.currentTarget).parent();
        $element.addClass('alert--removed');
      }
      if (alertTimeout) {
        $timeout.cancel(alertTimeout);
      }
      _removeAlert('uid', uid);
    };

    return exports;

  });

/* Alerts */
// Alert Example:
// <div class="alerts--container">
//     <div ng-repeat="alert in alerts.getAlerts()" class="test" ng-style="{'margin-top': 50*$index+'px'}">
//         <div class="alert {{alert.domClass}}" id="{{alert.id}}">
//             <i ng-if="alert.preIcon">
//                 <svg class="svg-icon icon--preicon">
//                     <use xlink:href="{{'images/sprite.svg#'+alert.preIcon}}"></use>
//                 </svg>
//             </i>
//             <span>{{alert.text | translate}}</span>
//             <i ng-if="alert.postIcon">
//                 <svg class="svg-icon icon--postIcon">
//                     <use xlink:href="{{'images/sprite.svg#'+alert.postIcon}}"></use>
//                 </svg>
//             </i>
//             <div class="alert--close" ng-click="alerts.close(alert.uid, $event)">
//                 <svg class="svg-icon">
//                     <use xlink:href="images/sprite.svg#icon-close"></use>
//                 </svg>
//             </div>
//         </div>
//     </div>
// </div>
/* Trigger */
// alerts.alert(text, id, type, time)