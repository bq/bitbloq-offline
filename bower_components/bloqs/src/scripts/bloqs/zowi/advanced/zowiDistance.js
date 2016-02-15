/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: zowiDistance
 *
 * Bloq type: Output
 *
 * Description: It returns the distance measurement that Zowi sees.
 *
 * Return type: float
 */

var zowiDistance = _.merge(_.clone(OutputBloq, true), {

    name: 'zowiDistance',
    bloqClass: 'bloq-zowi-distance',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-distance'
        }]
    ],
    code: 'zowi.getDistance()',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});
utils.generateBloqInputConnectors(zowiDistance);

module.exports = zowiDistance;