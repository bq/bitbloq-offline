/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: zowiMovementsFront
 *
 * Bloq type: statement
 *
 * Description: It makes Zowi walk in a concrete direction,
 *              selectable from a first drop-down, the given number
 *              of times at a determined velocity, selectable from a
 *              second drop-down.
 *
 * Return type: none
 */

var zowiMovementsFront = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiMovementsFront',
    bloqClass: 'bloq-zowi-movements-front',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-movements'
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-walk'
        }, {
            id: 'DIR',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-forward',
                value: 'FORWARD'
            }, {
                label: 'bloq-zowi-movements-backward',
                value: 'BACKWARD'
            }]
        }, {
            id: 'STEPS',
            alias: 'numberInput',
            value: 4
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-speed'
        }, {
            id: 'SPEED',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-speed-small',
                value: 'LOW_SPEED'
            }, {
                label: 'bloq-zowi-movements-speed-medium',
                value: 'MEDIUM_SPEED'
            }, {
                label: 'bloq-zowi-movements-speed-high',
                value: 'HIGH_SPEED'
            }]
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-endtext'
        }]
    ],
    code: 'zowi.walk({STEPS},{SPEED},{DIR});'
});
utils.generateBloqInputConnectors(zowiMovementsFront);

module.exports = zowiMovementsFront;