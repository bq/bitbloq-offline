/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: string
 *
 * Bloq type: Output
 *
 * Description: It returns a string pointer to an array of the given size.
 *
 * Return type: string pointer
 */

var stringArray = _.merge(_.clone(OutputBloq, true), {

    name: 'stringArray',
    bloqClass: 'bloq-stringArray',
    content: [
        [{
            alias: 'text',
            value: 'bloq-stringArray-arraySize'
        }, {
            id: 'VALUE',
            alias: 'numberInput',
            value: 3
        }, {
            alias: 'text',
            value: 'bloq-stringArray-stringType'
        }]
    ],
    code: '(String *)malloc({VALUE}*sizeof(String))',
    returnType: {
        type: 'simple',
        value: 'String *'
    }
});

utils.generateBloqInputConnectors(stringArray);

module.exports = stringArray;