/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: lcdTurnOnOffAdvanced
 * 
 * Bloq type: Statement
 *
 * Description: It switches on or off the background light of a
 *              specific LCD.
 * 
 * Return type: none
 */

var lcdTurnOnOffAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'lcdTurnOnOffAdvanced',
    bloqClass: 'bloq-lcd-turn-on-off-advanced',
    content: [
        [{
            id: 'STATE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-lcd-turn-on-off-advanced-turnon',
                value: 'HIGH'
            }, {
                label: 'bloq-lcd-turn-on-off-advanced-turnoff',
                value: 'LOW'
            }]
        }, {
            alias: 'text',
            value: 'bloq-lcd-turn-on-off-advanced-lcdLigth'
        }, {
            bloqInputId: 'LCD',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{LCD}.setBacklight({STATE});'
});

utils.generateBloqInputConnectors(lcdTurnOnOffAdvanced);

module.exports = lcdTurnOnOffAdvanced;