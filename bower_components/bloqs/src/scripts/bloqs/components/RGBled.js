/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: rgbLed
 *
 * Bloq type: Statement
 *
 * Description: It switches on a specific rgb led, selectable
 *              from a drop-down, with the given combination
 *              of each basic colour.
 *
 * Return type: none
 */

var rgbLed = _.merge(_.clone(StatementBloq, true), {

    name: 'rgbLed',
    bloqClass: 'bloq-rgbLed',
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
            id: 'RED',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'bloq-rgbLed-green'
        }, {
            id: 'GREEN',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'bloq-rgbLed-blue'
        }, {
            id: 'BLUE',
            alias: 'numberInput',
            value: 0
        }]
    ],
    code: '{LED}.setRGBcolor({RED},{GREEN},{BLUE});'
});

utils.generateBloqInputConnectors(rgbLed);

module.exports = rgbLed;