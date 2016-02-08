/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: analogWrite
 * 
 * Bloq type: Statement
 *
 * Description: It sets a specific analog pin with a given value.
 * 
 * Return type: none
 */

var analogWrite = _.merge(_.clone(StatementBloq, true), {

    name: 'analogWrite',
    bloqClass: 'bloq-pin-writte-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-pin-analog-write'
        }, {
            bloqInputId: 'PIN',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-pin-analog-write-data'
        }, {
            bloqInputId: 'DATA',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '\'{PIN}\'.indexOf(\'A\') !== -1 ? \'analogWrite({PIN},{DATA});\'.replace(/"/g, \'\') : \'analogWrite({PIN},{DATA});\'',
});

utils.generateBloqInputConnectors(analogWrite);


module.exports = analogWrite;