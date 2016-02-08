/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: clockRTC
 *
 * Bloq type: Output
 *
 * Description: It returns the date or the time, selectable
 *              from a first drop-down, of a specific RTC,
 *              selectable from a second drop-down.
 *
 * Return type: string
 */


var clockRTC = _.merge(_.clone(OutputBloq, true), {
    name: 'clockRTC',
    bloqClass: 'bloq-rtc',
    content: [
        [{
            alias: 'text',
            value: 'bloq-rtc'
        }, {
            id: 'RTC_FUNC',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-rtc-date',
                value: 'getDate'
            }, {
                label: 'bloq-rtc-time',
                value: 'getTime'
            }]
        }, {
            alias: 'text',
            value: 'bloq-rtc-using'
        }, {
            id: 'RTC',
            alias: 'dynamicDropdown',
            options: 'clocks'
        }]
    ],
    code: '{RTC}.{RTC_FUNC}()',
    returnType: {
        type: 'simple',
        value: 'String'
    }
});

utils.generateBloqInputConnectors(clockRTC);

module.exports = clockRTC;