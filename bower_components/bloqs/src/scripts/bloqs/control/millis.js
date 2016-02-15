/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: millis
 *
 * Bloq type: Output
 *
 * Description: It returns the time since the program began.
 *
 * Return type: float
 */

var millis = _.merge(_.clone(OutputBloq, true), {

    name: 'millis',
    bloqClass: 'bloq-millis',
    content: [
        [{
            alias: 'text',
            value: 'bloq-millis'
        }]
    ],
    code: 'millis()',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(millis);

module.exports = millis;