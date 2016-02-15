/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: map
 *
 * Bloq type: Output
 *
 * Description: It returns the given value between 0 and 1023,
 *              mapped between 0 and a given second value.
 *
 * Return type: float
 */

var map = _.merge(_.clone(OutputBloq, true), {

    name: 'map',
    bloqClass: 'bloq-map',
    content: [
        [{
            alias: 'text',
            value: 'bloq-map-map'
        }, {
            bloqInputId: 'VAR',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            alias: 'text',
            value: 'bloq-map-value'
        }, {
            bloqInputId: 'MAXVAL',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            alias: 'text',
            value: ']'
        }]
    ],
    code: 'map({VAR},0,1023,0,{MAXVAL})',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(map);

module.exports = map;