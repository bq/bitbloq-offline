/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: numberArray
 *
 * Bloq type: Output
 *
 * Description: It returns a float pointer to an array of the given size.
 *
 * Return type: float pointer
 */

var numberArray = _.merge(_.clone(OutputBloq, true), {

    name: 'numberArray',
    bloqClass: 'bloq-numberArray',
    content: [
        [{
            alias: 'text',
            value: 'bloq-numberArray-arraySize'
        }, {
            id: 'VALUE',
            alias: 'numberInput',
            value: 3
        }, {
            alias: 'text',
            value: 'bloq-numberArray-floatType'
        }]
    ],
    code: '(float*)malloc({VALUE}*sizeof(float))',
    returnType: {
        type: 'simple',
        value: 'float *'
    }
});

utils.generateBloqInputConnectors(numberArray);

module.exports = numberArray;