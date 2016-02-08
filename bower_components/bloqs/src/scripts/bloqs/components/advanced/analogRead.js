/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: analogReadAdvanced
 * 
 * Bloq type: Output
 *
 * Description: It returns the read of an analog pin.
 * 
 * Return type: float
 */

var analogReadAdvanced = _.merge(_.clone(OutputBloq, true), {

    name: 'analogReadAdvanced',
    bloqClass: 'bloq-analog-read-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-analog-read-advanced-readpin'
        }, {
            bloqInputId: 'PIN',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '\'{PIN}\'.indexOf(\'A\') !== -1 ? \'analogRead({PIN})\'.replace(/"/g, \'\') : \'analogRead({PIN})\'',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(analogReadAdvanced);

module.exports = analogReadAdvanced;