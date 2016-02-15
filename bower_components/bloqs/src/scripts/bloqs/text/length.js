/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: length
 *
 * Bloq type: Output
 *
 * Description: It returns the length of the given string.
 *
 * Return type: float
 */

var bloqLength = _.merge(_.clone(OutputBloq, true), {

    name: 'length',
    bloqClass: 'bloq-length',
    content: [
        [{
            alias: 'text',
            value: 'bloq-length-length'
        }, {
            bloqInputId: 'TEXT',
            alias: 'bloqInput',
            acceptType: 'String'
        }]
    ],
    code: '{TEXT}.length()',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(bloqLength);

module.exports = bloqLength;