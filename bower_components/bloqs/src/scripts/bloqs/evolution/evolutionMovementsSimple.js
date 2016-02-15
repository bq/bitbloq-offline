/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
* Bloq name: evolutionMovementsSimple
*
* Bloq type: statement
*
* Description: It makes Evolution execute a specific movement,
*              selectable from a drop-down.
*
* Return type: none
*/

var evolutionMovementsSimple = _.merge(_.clone(StatementBloq, true), {

    name: 'evolutionMovementsSimple',
    bloqClass: 'bloq-evolution-movements-simple',
    content: [
        [{
            alias: 'text',
            value: 'bloq-evolution-movements-simple'
        }, {
            id: 'MOVEMENT',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-evolution-movements-simple-fordward',
                value: 'fordward'
            }, {
                label: 'bloq-evolution-movements-simple-backward',
                value: 'backward'
            }, {
                label: 'bloq-evolution-movements-simple-right',
                value: 'right'
            }, {
                label: 'bloq-evolution-movements-simple-left',
                value: 'left'
            }]
        }]
    ],
    code: 'evolution.{MOVEMENT}();'
});
utils.generateBloqInputConnectors(evolutionMovementsSimple);

module.exports = evolutionMovementsSimple;