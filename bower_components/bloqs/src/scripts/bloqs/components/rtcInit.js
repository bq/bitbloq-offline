/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: clockRTCInit
 *
 * Bloq type: Statement
 *
 * Description: It synchronizes a specific RTC, selectable
 *              from a second drop-down, with the time and date
 *              of the computer.
 *
 * Return type: none
 */

var clockRTCInit = _.merge(_.clone(StatementBloq, true), {

    name: 'clockRTCInit',
    bloqClass: 'bloq-rtc-init',
    content: [
        [{
            alias: 'text',
            value: 'bloq-rtc-init'
        }, {
            id: 'RTC',
            alias: 'dynamicDropdown',
            options: 'clocks'
        }]
    ],
    code: '{RTC}.adjust(DateTime(__DATE__, __TIME__));'
});

utils.generateBloqInputConnectors(clockRTCInit);

module.exports = clockRTCInit;