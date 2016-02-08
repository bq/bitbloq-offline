/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
* Bloq name: evolutionLine
*
* Bloq type: Output
*
* Description: It returns the measurement of the line follower sensor
*              of a specific side, selectable from a drop-down.
*
* Return type: float
*/

var evolutionLine = _.merge(_.clone(OutputBloq, true), {

    name: 'evolutionLine',
    bloqClass: 'bloq-evolution-line',
    content: [
        [{
            alias: 'text',
            value: 'bloq-evolution-line'
        }, {
            id: 'SIDE',
            alias: 'staticDropdown',
            options: [{
                    label: 'bloq-evolution-line-left',
                    value: 'LEFT'
                }, {
                    label: 'bloq-evolution-line-right',
                    value: 'RIGHT'
                }]
        }, {
            alias: 'text',
            value: 'bloq-evolution-line-evolution'
        }]
    ],
    code: 'evolution.getLine({SIDE})',
    returnType: {
        type: 'simple',
        value: 'int'
    }
});
utils.generateBloqInputConnectors(evolutionLine);

module.exports = evolutionLine;