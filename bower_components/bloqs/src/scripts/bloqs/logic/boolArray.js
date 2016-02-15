/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: boolArray
 *
 * Bloq type: Output
 *
 * Description: It returns a boolean pointer to an array of the given size.
 *
 * Return type: bool pointer
 */

var boolArray = _.merge(_.clone(OutputBloq, true), {

    name: 'boolArray',
    bloqClass: 'bloq-boolArray',
    content: [
        [{
            alias: 'text',
            value: 'bloq-boolArray-arraySize'
        }, {
            id: 'VALUE',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'bloq-boolArray-boolType'
        }]
    ],
    code: '(bool *)malloc({VALUE}*sizeof(bool))',
    returnType: {
        type: 'simple',
        value: 'bool *'
    }
});

utils.generateBloqInputConnectors(boolArray);

module.exports = boolArray;