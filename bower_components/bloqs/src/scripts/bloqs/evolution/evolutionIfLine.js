/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
* Bloq name: evolutionIfLine
*
* Bloq type: Statement-Input
*
* Description: It executes the following code only if Evolution detects
*              black or white, selectable from two drop-downs, in both
*              line follower sensors.
*
* Return type: none
*/

var evolutionIfLine = _.merge(_.clone(StatementInputBloq, true), {

    name: 'evolutionIfLine',
    bloqClass: 'bloq-evolution-if-line',
    content: [
        [{
            alias: 'text',
            value: 'bloq-evolution-if-line'
        }, {
            id: 'LINELEFT',
            alias: 'staticDropdown',
            options: [{
                    label: 'bloq-evolution-if-line-white',
                    value: '0'
                }, {
                    label: 'bloq-evolution-if-line-black',
                    value: '1'
                }]
        }, {
            alias: 'text',
            value: 'bloq-evolution-if-line-and'
        }, {
            id: 'LINERIGHT',
            alias: 'staticDropdown',
            options: [{
                    label: 'bloq-evolution-if-line-white',
                    value: '0'
                }, {
                    label: 'bloq-evolution-if-line-black',
                    value: '1'
                }]
        }, {
            alias: 'text',
            value: 'bloq-evolution-if-line-then'
        },]
    ],
    code: 'if(evolution.getLine(LEFT) == {LINELEFT} && evolution.getLine(RIGHT) == {LINERIGHT}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(evolutionIfLine);

module.exports = evolutionIfLine;
