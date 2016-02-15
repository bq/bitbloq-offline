/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: oscillatorTimes
 *
 * Bloq type: Statement
 *
 * Description: It sets a specific servo, selectable from a
 *              drop-down, to oscillate around a given point
 *              with a certain amplitude and velocity, a defined
 *              number of times.
 *
 * Return type: none
 */

var oscillatorTimes = _.merge(_.clone(StatementBloq, true), {

    name: 'oscillatorTimes',
    bloqClass: 'bloq-oscillator',
    content: [
        [{
            alias: 'text',
            value: 'bloq-oscillator-oscillate'
        }, {
            id: 'OSCILLATOR',
            alias: 'dynamicDropdown',
            options: 'oscillators'
        }, {
            alias: 'text',
            value: 'bloq-oscillator-around'
        }, {
            id: 'PHASE',
            alias: 'numberInput',
            value: 90,
        }, {
            alias: 'text',
            value: 'bloq-oscillator-amplitude'
        }, {
            id: 'AMPLITUDE',
            alias: 'numberInput',
            value: 90,
        }, {
            alias: 'text',
            value: 'bloq-oscillator-speed'
        }, {
            id: 'SPEED',
            alias: 'numberInput',
            value: 2000,
        }, {
            id: 'TIMES',
            alias: 'numberInput',
            value: 2,
        }, {
            alias: 'text',
            value: 'bloq-oscillator-times'
        }]
    ],
    code: 'oscillate({OSCILLATOR}, {AMPLITUDE}, {PHASE}, {SPEED}, {TIMES});'
});

utils.generateBloqInputConnectors(oscillatorTimes);

module.exports = oscillatorTimes;