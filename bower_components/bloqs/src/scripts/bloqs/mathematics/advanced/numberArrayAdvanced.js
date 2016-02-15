/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: numberArrayAdvanced
 *
 * Bloq type: Output
 *
 * Description: It returns a float pointer or an int pointer, selectable
 *              from a dorp-down, to an array of the given size.
 *
 * Return type: selected type pointer
 */

var numberArrayAdvanced = _.merge(_.clone(OutputBloq, true), {

    name: 'numberArrayAdvanced',
    bloqClass: 'bloq-numberArray-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-numberArray-advanced-arraySize'
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-numberArray-advanced-type'
        }, {
            id: 'TYPE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-numberArray-advanced-float',
                value: 'float *'
            }, {
                label: 'bloq-numberArray-advanced-int',
                value: 'int *'
            }]
        }]
    ],
    code: '({TYPE})malloc({VALUE}*sizeof({TYPE.withoutAsterisk}))',
    returnType: {
        type: 'fromDropdown',
        idDropdown: 'TYPE',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(numberArrayAdvanced);

module.exports = numberArrayAdvanced;