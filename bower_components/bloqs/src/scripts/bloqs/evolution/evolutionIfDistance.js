/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
* Bloq name: evolutionIfDistance
*
* Bloq type: Statement-Input
*
* Description: It executes the following code only if Evolution detects
*              a specific distance.
*
* Return type: none
*/

var evolutionIfDistance = _.merge(_.clone(StatementInputBloq, true), {

    name: 'evolutionIfDistance',
    bloqClass: 'bloq-evolution-if-distance',
    content: [
        [{
            alias: 'text',
            value: 'bloq-evolution-if-distance'
        }, {
            id: 'OPERATOR',
            alias: 'staticDropdown',
            options: [{
                    label: 'bloq-evolution-if-distance-less',
                    value: '<'
                }, {
                    label: 'bloq-evolution-if-distance-more',
                    value: '>'
                }]
        }, {
            alias: 'text',
            value: 'bloq-evolution-if-distance-than'
        }, {
            id: 'DISTANCE',
            alias: 'numberInput',
            value: 15
        }, {
            alias: 'text',
            value: 'bloq-evolution-if-distance-then'
        },]
    ],
    code: 'if(evolution.getDistance() {OPERATOR} {DISTANCE}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(evolutionIfDistance);

module.exports = evolutionIfDistance;
