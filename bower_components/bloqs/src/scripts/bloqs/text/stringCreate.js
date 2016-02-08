/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: stringCreate
 *
 * Bloq type: Output
 *
 * Description: It returns the given input converted into string.
 *
 * Return type: string
 */

var stringCreate = _.merge(_.clone(OutputBloq, true), {

    name: 'stringCreate',
    bloqClass: 'bloq-string-create',
    content: [
        [{
            alias: 'text',
            value: 'bloq-string-create-create'
        }, {
            bloqInputId: 'TEXT',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: 'String({TEXT})',
    returnType: {
        type: 'simple',
        value: 'String'
    }
});

utils.generateBloqInputConnectors(stringCreate);

module.exports = stringCreate;