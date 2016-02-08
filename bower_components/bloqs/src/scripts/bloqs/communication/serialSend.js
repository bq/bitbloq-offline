/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: serialSend-v1
 *
 * Bloq type: Statement
 *
 * Description: It sends by the serial port what is input with
 *              or without newline end.
 *
 * Return type: none
 */

var serialSendV1 = _.merge(_.clone(StatementBloq, true), {

    name: 'serialSend-v1',
    bloqClass: 'bloq-serial-send',
    content: [
        [{
            id: 'SERIAL',
            alias: 'dynamicDropdown',
            options: 'serialElements'
        }, {
            alias: 'text',
            value: 'bloq-serial-send-send'
        }, {
            bloqInputId: 'DATA',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            id: 'LN',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-serial-send-println',
                value: 'println'
            }, {
                label: 'bloq-serial-send-print',
                value: 'print'
            }]
        }]
    ],
    code: '{SERIAL}.{LN}({DATA});'
});
utils.generateBloqInputConnectors(serialSendV1);

module.exports = serialSendV1;