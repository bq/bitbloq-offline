/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: zowiMovementsHeightFront
 *
 * Bloq type: statement
 *
 * Description: It makes Zowi flap in a concrete direction,
 *              selectable from a first drop-down, the given number
 *              of times at a determined velocity, selectable from a
 *              second drop-down, until a limit height, selectable
 *              from a third drop-down.
 *
 * Return type: none
 */

var zowiMovementsHeightFront = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiMovementsHeightFront',
    bloqClass: 'bloq-zowi-movements-height-front',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-movements-height'
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-height-flapping'
        }, {
            id: 'DIR',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-height-forward',
                value: 'FORWARD'
            }, {
                label: 'bloq-zowi-movements-height-backward',
                value: 'BACKWARD'
            }]
        }, {
            id: 'STEPS',
            alias: 'numberInput',
            value: 1
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-height-speed'
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
            value: 'bloq-zowi-movements-height-height'
        }, {
            id: 'HEIGHT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-height-small',
                value: 'SMALL_HEIGHT'
            }, {
                label: 'bloq-zowi-movements-height-medium',
                value: 'MEDIUM_HEIGHT'
            }, {
                label: 'bloq-zowi-movements-height-big',
                value: 'BIG_HEIGHT'
            }]
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-height-endtext'
        }]
    ],
    code: 'zowi.flapping({STEPS},{SPEED},{HEIGHT},{DIR});'
});
utils.generateBloqInputConnectors(zowiMovementsHeightFront);

module.exports = zowiMovementsHeightFront;