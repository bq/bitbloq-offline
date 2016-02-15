/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: ledAdvanced
 * 
 * Bloq type: Statement
 *
 * Description: It switches on or off aspecific led.
 * 
 * Return type: none
 */

var ledAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'ledAdvanced',
    bloqClass: 'bloq-led-advanced',
    content: [
        [{
            id: 'STATE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-led-advanced-turnon',
                value: 'HIGH'
            }, {
                label: 'bloq-led-advanced-turnoff',
                value: 'LOW'
            }]
        }, {
            alias: 'text',
            value: 'bloq-led-advanced-theLED'
        }, {
            bloqInputId: 'LED',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: 'digitalWrite({LED},{STATE});'
});

utils.generateBloqInputConnectors(ledAdvanced);

module.exports = ledAdvanced;