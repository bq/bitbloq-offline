/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: clockRTCAdvanced
 *
 * Bloq type: Output
 *
 * Description: It returns a determined data of the date or the time,
 *              selectable from a first drop-down, of a specific RTC,
 *              selectable from a second drop-down.
 *
 * Return type: int
 */

var clockRTCAdvanced = _.merge(_.clone(OutputBloq, true), {
    name: 'clockRTCAdvanced',
    bloqClass: 'bloq-rtc-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-rtc-advanced'
        }, {
            id: 'FUNCTION',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-rtc-hour',
                value: 'getHour'
            }, {
                label: 'bloq-rtc-minute',
                value: 'getMinute'
            }, {
                label: 'bloq-rtc-second',
                value: 'getSecond'
            }, {
                label: 'bloq-rtc-day',
                value: 'getDay'
            }, {
                label: 'bloq-rtc-month',
                value: 'getMonth'
            }, {
                label: 'bloq-rtc-year',
                value: 'getYear'
            }]
        }, {
            alias: 'text',
            value: 'bloq-rtc-using-advanced'
        }, {
            id: 'RTC',
            alias: 'dynamicDropdown',
            options: 'clocks'
        }]
    ],
    code: '{RTC}.{FUNCTION}()',
    returnType: {
        type: 'simple',
        value: 'int'
    }
});

utils.generateBloqInputConnectors(clockRTCAdvanced);

module.exports = clockRTCAdvanced;