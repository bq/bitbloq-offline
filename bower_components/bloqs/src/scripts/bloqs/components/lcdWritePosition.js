/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: lcdWritePosition
 *
 * Bloq type: Statement
 *
 * Description: It writes the given string on a specific LCD,
 *              selectable from a drop-down, in a particular position.
 *
 * Return type: none
 */

var lcdWritePosition = _.merge(_.clone(StatementBloq, true), {

    name: 'lcdWritePosition',
    bloqClass: 'bloq-lcd-writte',
    content: [
        [{
            alias: 'text',
            value: 'bloq-lcd-writte-write'
        }, {
            id: 'TEXT',
            alias: 'stringInput',
            defaultValue: 'bloq-lcd-default'
        }, {
            alias: 'text',
            value: 'bloq-lcd-writte-inLCD'
        }, {
            id: 'LCD',
            alias: 'dynamicDropdown',
            options: 'lcds'
        }, {
            alias: 'text',
            value: 'bloq-lcd-writte-advanced-inPosition'
        }, {
            id: 'COLUMN',
            alias: 'numberInput',
            value: 0
        }, {
            id: 'ROW',
            alias: 'numberInput',
            value: 0
        }]
    ],
    code: '{LCD}.setCursor({COLUMN},{ROW});{LCD}.print("{TEXT}");'

});

utils.generateBloqInputConnectors(lcdWritePosition);

module.exports = lcdWritePosition;