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
 * Description: It returns the written string.
 *
 * Return type: string
 */

var string = _.merge(_.clone(OutputBloq, true), {

    name: 'string',
    bloqClass: 'bloq-string',
    content: [
        [{
            alias: 'text',
            value: '"'
        }, {
            id: 'TEXT',
            alias: 'stringInput',
            placeholder: 'bloq-string-string'
        }, {
            alias: 'text',
            value: '"'
        }]
    ],
    code: '"{TEXT}"',
    returnType: {
        type: 'simple',
        value: 'String'
    }
});

utils.generateBloqInputConnectors(string);

module.exports = string;