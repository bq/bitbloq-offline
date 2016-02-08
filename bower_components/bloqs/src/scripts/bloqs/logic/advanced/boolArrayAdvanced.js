/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: boolArrayAdvanced
 *
 * Bloq type: Output
 *
 * Description: It returns a boolean pointer to an array of the given size.
 *
 * Return type: bool pointer
 */

var boolArrayAdvanced = _.merge(_.clone(OutputBloq, true), {

    name: 'boolArrayAdvanced',
    bloqClass: 'bloq-boolArray-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-boolArray-advanced-arraySize'
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-boolArray-advanced-boolType'
        }]
    ],
    code: '(bool *)malloc({VALUE}*sizeof(bool))',
    returnType: {
        type: 'simple',
        value: 'bool *'
    }
});

utils.generateBloqInputConnectors(boolArrayAdvanced);

module.exports = boolArrayAdvanced;