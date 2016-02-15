/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: rgbLedAdvanced
 * 
 * Bloq type: Statement
 *
 * Description: It switches on a specific rgb led, selectable
 *              from a drop-down, with the given combination
 *              of each basic colour.
 * 
 * Return type: none
 */

var rgbLedAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'rgbLedAdvanced',
    bloqClass: 'bloq-rgbLed-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-rgbLed'
        }, {
            id: 'LED',
            alias: 'dynamicDropdown',
            options: 'rgbs'
        }, {
            alias: 'text',
            value: 'bloq-rgbLed-red'
        }, {
            bloqInputId: 'RED',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-rgbLed-green'
        }, {
            bloqInputId: 'GREEN',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-rgbLed-blue'
        }, {
            bloqInputId: 'BLUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{LED}.setRGBcolor({RED},{GREEN},{BLUE});'
});

utils.generateBloqInputConnectors(rgbLedAdvanced);

module.exports = rgbLedAdvanced;