/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: servoNormalAdvanced
 * 
 * Bloq type: Statement
 *
 * Description: It sets a specific servo in a given position.
 * 
 * Return type: none
 */

var servoNormalAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'servoNormalAdvanced',
    bloqClass: 'bloq-servo-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-servo-advanced-move'
        }, {
            bloqInputId: 'SERVO',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-servo-advanced-to'
        }, {
            bloqInputId: 'POSITION',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-servo-advanced-degrees'
        }]
    ],
    code: '{SERVO}.write({POSITION});'
});

utils.generateBloqInputConnectors(servoNormalAdvanced);

module.exports = servoNormalAdvanced;