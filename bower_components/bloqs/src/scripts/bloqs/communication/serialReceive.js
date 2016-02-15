/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: serialReceive
 *
 * Bloq type: Output
 *
 * Description: It returns what is received by the serial port.
 *
 * Return type: String
 */

var serialReceive = _.merge(_.clone(OutputBloq, true), {

    name: 'serialReceive',
    bloqClass: 'bloq-serial-receiver',
    content: [
        [{
            id: 'SERIAL',
            alias: 'dynamicDropdown',
            options: 'serialElements'
        }, {
            alias: 'text',
            value: 'bloq-serial-receiver-receive'
        }]
    ],
    code: '{SERIAL}.readString()',
    returnType: {
        type: 'simple',
        value: 'String'
    }
});
utils.generateBloqInputConnectors(serialReceive);

module.exports = serialReceive;