/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: char
 *
 * Bloq type: Output
 *
 * Description: It returns the written char.
 *
 * Return type: char
 */

var bloqChar = _.merge(_.clone(OutputBloq, true), {

    name: 'char',
    bloqClass: 'bloq-string',
    content: [
        [{
            alias: 'text',
            value: '\''
        }, {
            id: 'TEXT',
            alias: 'charInput',
            placeholder: 'bloq-char'
        }, {
            alias: 'text',
            value: '\''
        }]
    ],
    code: '\'{TEXT}\'',
    returnType: {
        type: 'simple',
        value: 'char'
    }
});

utils.generateBloqInputConnectors(bloqChar);

module.exports = bloqChar;