/*--IN PROGRESS--*/

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: convert
 *
 * Bloq type: Output
 *
 * Description: It converts a number in decimal base to
 *              binary, octal or hexadecimal.
 *
 * Return type: float
 */

var convert = _.merge(_.clone(OutputBloq, true), {

    name: 'convert',
    bloqClass: 'bloq-convert',
    content: [
        [{
            alias: 'text',
            value: 'bloq-convert-convert'
        }, {
            bloqInputId: 'NUMBER',
            alias: 'bloqInput',
            acceptType: 'number'
        }, {
            alias: 'text',
            value: 'bloq-convert-to'
        }, {
            id: 'TYPE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-convert-dec',
                value: 'DEC'
            }, {
                label: 'bloq-convert-hex',
                value: 'HEX'
            }, {
                label: 'bloq-convert-oct',
                value: 'OCT'
            }, {
                label: 'bloq-convert-bin',
                value: 'BIN'
            }]
        }]
    ],
    code: '({NUMBER},{TYPE});',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});
utils.generateBloqInputConnectors(convert);

module.exports = convert;