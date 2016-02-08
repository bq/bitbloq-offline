/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
* Bloq name: evolutionHead
*
* Bloq type: statement
*
* Description: It makes Evolution turn its head to a specific side,
*              selectable from a drop-down.
*
* Return type: none
*/

var evolutionHead = _.merge(_.clone(StatementBloq, true), {

    name: 'evolutionHead',
    bloqClass: 'bloq-evolution-head',
    content: [
        [{
            alias: 'text',
            value: 'bloq-evolution-head'
        }, {
            id: 'SIDE',
            alias: 'staticDropdown',
            options: [{
                    label: 'bloq-evolution-head-center',
                    value: 'HEAD_CENTER'
                }, {
                    label: 'bloq-evolution-head-left',
                    value: 'HEAD_LEFT'
                }, {
                    label: 'bloq-evolution-head-right',
                    value: 'HEAD_RIGHT'
                }]
        }]
    ],
    code: 'evolution.turnHead({SIDE});',
});
utils.generateBloqInputConnectors(evolutionHead);

module.exports = evolutionHead;