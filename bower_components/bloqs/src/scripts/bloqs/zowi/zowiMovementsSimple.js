/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: zowiMovementsSimple
 *
 * Bloq type: statement
 *
 * Description: It makes Zowi execute a specific movement,
 *              selectable from a drop-down, the given number of times.
 *
 * Return type: none
 */

var zowiMovementsSimple = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiMovementsSimple',
    bloqClass: 'bloq-zowi-movements-simple',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-movements-simple'
        }, {
            id: 'MOVEMENT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-movements-simple-walk',
                value: 'walk'
            }, {
                label: 'bloq-zowi-movements-simple-turn',
                value: 'turn'
            }, {
                label: 'bloq-zowi-movements-simple-shakeLeg',
                value: 'shakeLeg'
            }, {
                label: 'bloq-zowi-movements-simple-bend',
                value: 'bend'
            }, {
                label: 'bloq-zowi-movements-simple-moonwalker',
                value: 'moonwalker'
            }, {
                label: 'bloq-zowi-movements-simple-crusaito',
                value: 'crusaito'
            }, {
                label: 'bloq-zowi-movements-simple-flapping',
                value: 'flapping'
            }, {
                label: 'bloq-zowi-movements-simple-updown',
                value: 'updown'
            }, {
                label: 'bloq-zowi-movements-simple-swing',
                value: 'swing'
            }, {
                label: 'bloq-zowi-movements-simple-tiptoeSwing',
                value: 'tiptoeSwing'
            }, {
                label: 'bloq-zowi-movements-simple-jitter',
                value: 'jitter'
            }, {
                label: 'bloq-zowi-movements-simple-ascendingTurn',
                value: 'ascendingTurn'
            }, {
                label: 'bloq-zowi-movements-simple-jump',
                value: 'jump'
            }]
        }, {
            id: 'STEPS',
            alias: 'numberInput',
            value: 4
        }, {
            alias: 'text',
            value: 'bloq-zowi-movements-simple-steps'
        }]
    ],
    code: 'zowi.{MOVEMENT}({STEPS});'
});
utils.generateBloqInputConnectors(zowiMovementsSimple);

module.exports = zowiMovementsSimple;