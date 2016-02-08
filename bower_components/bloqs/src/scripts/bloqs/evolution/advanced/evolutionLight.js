/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
* Bloq name: evolutionLight
*
* Bloq type: Output
*
* Description: It returns the light measurement that Evolution sees
*              by a specific side, selectable from a drop-down.
*
* Return type: float
*/

var evolutionLight = _.merge(_.clone(OutputBloq, true), {

    name: 'evolutionLight',
    bloqClass: 'bloq-evolution-light',
    content: [
        [{
            alias: 'text',
            value: 'bloq-evolution-light'
        }, {
            id: 'SIDE',
            alias: 'staticDropdown',
            options: [{
                    label: 'bloq-evolution-light-left',
                    value: 'LEFT'
                }, {
                    label: 'bloq-evolution-light-right',
                    value: 'RIGHT'
                }]
        }, {
            alias: 'text',
            value: 'bloq-evolution-light-evolution'
        }]
    ],
    code: 'evolution.getLight({SIDE})',
    returnType: {
        type: 'simple',
        value: 'int'
    }
});
utils.generateBloqInputConnectors(evolutionLight);

module.exports = evolutionLight;