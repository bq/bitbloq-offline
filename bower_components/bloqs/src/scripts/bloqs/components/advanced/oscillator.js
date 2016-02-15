/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: oscillatorAdvanced
 * 
 * Bloq type: Statement
 *
 * Description: It sets a specific servo to oscillate around a given
 *              point with a certain amplitude and velocity.
 * 
 * Return type: none
 */

var oscillatorAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'oscillatorAdvanced',
    bloqClass: 'bloq-oscillator-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-oscillator-advanced-oscillate'
        }, {
            bloqInputId: 'OSCILLATOR',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-oscillator-advanced-around'
        }, {
            bloqInputId: 'PHASE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-oscillator-advanced-amplitude'
        }, {
            bloqInputId: 'AMPLITUDE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-oscillator-advanced-speed'
        }, {
            bloqInputId: 'SPEED',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{OSCILLATOR}.SetO({PHASE});\n{OSCILLATOR}.SetA({AMPLITUDE});\n{OSCILLATOR}.SetT({SPEED});\n{OSCILLATOR}.refresh();'
});

utils.generateBloqInputConnectors(oscillatorAdvanced);

module.exports = oscillatorAdvanced;