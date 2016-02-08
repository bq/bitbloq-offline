/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: stringArrayAdvanced
 *
 * Bloq type: Output
 *
 * Description: It returns a string pointer or a char pointer, selectable
 *              from a drop-down, to an array of the given size.
 *
 * Return type: string pointer
 */

var stringArrayAdvanced = _.merge(_.clone(OutputBloq, true), {

    name: 'stringArrayAdvanced',
    bloqClass: 'bloq-stringArray-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-stringArray-advanced-arraySize'
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-stringArray-advanced-type'
        }, {
            id: 'TYPE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-stringArray-advanced-string',
                value: 'String *'
            }, {
                label: 'bloq-stringArray-advanced-char',
                value: 'char *'
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

utils.generateBloqInputConnectors(stringArrayAdvanced);

module.exports = stringArrayAdvanced;