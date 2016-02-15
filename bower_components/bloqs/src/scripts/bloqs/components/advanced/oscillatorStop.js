/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: oscillatorStopAdvanced
 * 
 * Bloq type: Statement
 *
 * Description: It stops a specific servo.
 * 
 * Return type: none
 */

var oscillatorStopAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'oscillatorStopAdvanced',
    bloqClass: 'bloq-oscillator-stop-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-oscillator-stop-advanced-stop'
        }, {
            bloqInputId: 'OSCILLATOR',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{OSCILLATOR}.stop()'

});
utils.generateBloqInputConnectors(oscillatorStopAdvanced);

module.exports = oscillatorStopAdvanced;