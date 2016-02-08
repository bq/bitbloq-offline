/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: lcdWrite
 *
 * Bloq type: Statement
 *
 * Description: It writes the given string on a specific LCD,
 *              selectable from a drop-down.
 *
 * Return type: none
 */

var lcdWrite = _.merge(_.clone(StatementBloq, true), {

    name: 'lcdWrite',
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
        }]
    ],
    code: '{LCD}.print("{TEXT}");'

});

utils.generateBloqInputConnectors(lcdWrite);

module.exports = lcdWrite;