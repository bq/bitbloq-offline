/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: continuousServoStartAdvanced
 * 
 * Bloq type: Statement
 *
 * Description: It turns on a specific continuous servo in one of the two directions,
 *              selectable from a drop-down.
 * 
 * Return type: none
 */

var continuousServoStartAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'continuousServoStartAdvanced',
    bloqClass: 'bloq-continuous-servo-start-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-continuous-servo-start-advanced-turn'
        }, {
            continuousServoStartAdvancedInputId: 'SERVO',
            alias: 'continuousServoStartAdvancedInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-continuous-servo-start-advanced-direction'
        }, {
            id: 'DIRECTION',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-continuous-servo-start-advanced-clockwise',
                value: '0'
            }, {
                label: 'bloq-continuous-servo-start-advanced-counterclockwise',
                value: '180'
            }]
        }]
    ],
    code: '{SERVO}.write({DIRECTION});'
});

utils.generateBloqInputConnectors(continuousServoStartAdvanced);


module.exports = continuousServoStartAdvanced;