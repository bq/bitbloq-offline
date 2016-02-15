/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: continuousServoStartAdvanced-v1
 * 
 * Bloq type: Statement
 *
 * Description: It turns on a specific continuous servo to a determined direction.
 * 
 * Return type: none
 */

var continuousServoStartAdvancedV1 = _.merge(_.clone(StatementBloq, true), {

    name: 'continuousServoStartAdvanced-v1',
    bloqClass: 'bloq-continuous-servo-start-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-continuous-servo-start-advanced-turn'
        }, {
            bloqInputId: 'SERVO',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-continuous-servo-start-advanced-direction'
        }, {
            bloqInputId: 'DIRECTION',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{SERVO}.write({DIRECTION});'
});

utils.generateBloqInputConnectors(continuousServoStartAdvancedV1);


module.exports = continuousServoStartAdvancedV1;