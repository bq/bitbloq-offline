/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: zowiMovementsHeight
 *
 * Bloq type: statement
 *
 * Description: It makes Zowi execute a specific movement, selectable
 *              from a first drop-down, in a concrete direction,
 *              selectable from a second drop-down, the given number
 *              of times at a determined velocity, selectable from a
 *              third drop-down, until a limit height, selectable
 *              from a fourth drop-down.
 *
 * Return type: none
 */

var zowiMovementsHeight = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiMovementsHeight',
    bloqClass: 'bloq-zowi-movements-height',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-movements-height'
        }, {
            id: 'MOVEMENT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-height-moonwalker',
                value: 'moonwalker'
            }, {
                label: 'bloq-zowi-movements-height-crusaito',
                value: 'crusaito'
            }, {
                label: 'bloq-zowi-movements-height-flapping',
                value: 'flapping'
            }]
        }, {
            id: 'DIR',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-height-forward',
                value: 'FORWARD'
            }, {
                label: 'bloq-zowi-movements-height-backward',
                value: 'BACKWARD'
            }, {
                label: 'bloq-zowi-movements-height-left',
                value: 'LEFT'
            }, {
                label: 'bloq-zowi-movements-height-right',
                value: 'RIGHT'
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
    code: 'zowi.{MOVEMENT}({STEPS},{SPEED},{HEIGHT},{DIR});'
});
utils.generateBloqInputConnectors(zowiMovementsHeight);

module.exports = zowiMovementsHeight;