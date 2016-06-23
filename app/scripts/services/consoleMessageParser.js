/**
 * @ngdoc service
 * @name bitbloqOffline:ConsoleServerParser
 *
 * @description
 *
 *
 * */
'use strict';
angular.module('bitbloqOffline')
    .service('ConsoleMessageParser', function () {
        var buffer = '',
            self = this;

        this.INIT = '_$INIT$_';
        this.END = '_$END$_';

        this.addData = function (data) {
            data = buffer + data;

            var messages = [],
                messages_to_end = data.split(this.END);

            this.buffer = messages_to_end.pop();
            messages_to_end.forEach(function (m2e) {
                var splitMessage = m2e.split(self.INIT);
                if (splitMessage.length > 0) {
                    messages.push(splitMessage.pop());
                } else {
                    console.warn('message corrupted (ignored)', m2e);
                }
            });
            return messages;
        };

    });

