/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: lcdWritePositionAdvanced
 * 
 * Bloq type: Statement
 *
 * Description: It writes the given string on a specific LCD in a particular
 *              position.
 * 
 * Return type: none
 */

var lcdWritePositionAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'lcdWritePositionAdvanced',
    bloqClass: 'bloq-lcd-writte deprecated',
    content: [
        [{
            alias: 'text',
            value: 'bloq-lcd-writte-write'
        }, {
            bloqInputId: 'TEXT',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-lcd-writte-inLCD'
        }, {
            bloqInputId: 'LCD',
            alias: 'bloqInput',
            acceptType: 'all'
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
    code: '{LCD}.setCursor({COLUMN},{ROW});{LCD}.print({TEXT});'

});

utils.generateBloqInputConnectors(lcdWritePositionAdvanced);

module.exports = lcdWritePositionAdvanced;