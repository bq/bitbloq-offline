/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: random
 *
 * Bloq type: Output
 *
 * Description: It returns a random value between two given values.
 *
 * Return type: float
 */

var random = _.merge(_.clone(OutputBloq, true), {

    name: 'random',
    bloqClass: 'bloq-random',
    content: [
        [{
            alias: 'text',
            value: 'bloq-random-random'
        }, {
            bloqInputId: 'ARG1',
            alias: 'bloqInput',
            acceptType: 'float'
        }, {
            alias: 'text',
            value: 'bloq-random-and'
        }, {
            bloqInputId: 'ARG2',
            alias: 'bloqInput',
            acceptType: 'float'
        }]
    ],
    code: 'random({ARG1},{ARG2}+1)',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(random);

module.exports = random;