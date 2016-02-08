/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: pinReadAdvanced
 * 
 * Bloq type: Output
 *
 * Description: It returns the read of a pin.
 * 
 * Return type: bool
 */

var pinReadAdvanced = _.merge(_.clone(OutputBloq, true), {

    name: 'pinReadAdvanced',
    bloqClass: 'bloq-pin-read-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-pin-read-advanced-readpin'
        }, {
            bloqInputId: 'PIN',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '\'{PIN}\'.indexOf(\'A\') !== -1 ? \'analogRead({PIN})\' : \'digitalRead({PIN})\'',
    returnType: {
        type: 'simple',
        value: 'bool'
    }
});

utils.generateBloqInputConnectors(pinReadAdvanced);

module.exports = pinReadAdvanced;