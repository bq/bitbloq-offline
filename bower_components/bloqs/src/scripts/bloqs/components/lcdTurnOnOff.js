/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: lcdTurnOnOff
 *
 * Bloq type: Statement
 *
 * Description: It switches on or off the background light of a
 *              specific LCD, selectable from a drop-down.
 *
 * Return type: none
 */

var lcdTurnOnOff = _.merge(_.clone(StatementBloq, true), {

    name: 'lcdTurnOnOff',
    bloqClass: 'bloq-lcd-turn-on-off',
    content: [
        [{
            id: 'STATE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-lcd-turn-on-off-turnon',
                value: 'HIGH'
            }, {
                label: 'bloq-lcd-turn-on-off-turnoff',
                value: 'LOW'
            }]
        }, {
            alias: 'text',
            value: 'bloq-lcd-turn-on-off-lcdLigth'
        }, {
            id: 'LCD',
            alias: 'dynamicDropdown',
            options: 'lcds'
        }]
    ],
    code: '{LCD}.setBacklight({STATE});'
});

utils.generateBloqInputConnectors(lcdTurnOnOff);

module.exports = lcdTurnOnOff;