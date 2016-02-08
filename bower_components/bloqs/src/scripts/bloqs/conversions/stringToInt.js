/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: stringToInt
 *
 * Bloq type: Output
 *
 * Description: It converts the given string type value to int type.
 *
 * Return type: int
 */

var stringToInt = _.merge(_.clone(OutputBloq, true), {

    name: 'stringToInt',
    bloqClass: 'bloq-string-to-int',
    content: [
        [{
            alias: 'text',
            value: 'bloq-string-to-int'
        }, {
            bloqInputId: 'VAR',
            alias: 'bloqInput',
            acceptType: 'String'
        }]
    ],
    code: '{VAR}.toInt()',
    returnType: {
        type: 'simple',
        value: 'int'
    }
});

utils.generateBloqInputConnectors(stringToInt);


module.exports = stringToInt;