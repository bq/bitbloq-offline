/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: oscillatorStartAdvanced
 * 
 * Bloq type: Statement
 *
 * Description: It makes a specific servo oscillate as it has been set.
 * 
 * Return type: none
 */

var oscillatorStartAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'oscillatorStartAdvanced',
    bloqClass: 'bloq-oscillator-start-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-oscillator-start-advanced-oscillator'
        }, {
            bloqInputId: 'OSCILLATOR',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{OSCILLATOR}.start()'
});

utils.generateBloqInputConnectors(oscillatorStartAdvanced);

module.exports = oscillatorStartAdvanced;