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
    .service('consoleMessageParser', function () {
        var buffer = '',
            self = this;

        this.INIT = '_$INIT$_';
        this.END = '_$END$_';

        this.addData = function (data) {
            data = buffer + data;

            var messages = [],
                messagesToEnd = data.split(this.END);

            this.buffer = messagesToEnd.pop();
            messagesToEnd.forEach(function (m2e) {
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

