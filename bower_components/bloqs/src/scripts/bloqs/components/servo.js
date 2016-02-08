/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: servoNormal
 *
 * Bloq type: Statement
 *
 * Description: It sets a specific servo, selectable from a
 *              drop-down, in a given position.
 *
 * Return type: none
 */

var servoNormal = _.merge(_.clone(StatementBloq, true), {

    name: 'servoNormal',
    bloqClass: 'bloq-servo',
    content: [
        [{
            alias: 'text',
            value: 'bloq-servo-move'
        }, {
            id: 'SERVO',
            alias: 'dynamicDropdown',
            options: 'servos'
        }, {
            alias: 'text',
            value: 'bloq-servo-to'
        }, {
            id: 'POSITION',
            alias: 'numberInput',
            value: 90
        }, {
            alias: 'text',
            value: 'bloq-servo-degrees'
        }]
    ],
    code: '{SERVO}.write({POSITION});'
});

utils.generateBloqInputConnectors(servoNormal);

module.exports = servoNormal;