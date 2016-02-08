/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: oscillator
 *
 * Bloq type: Statement
 *
 * Description: It sets a specific servo, selectable from a
 *              drop-down, to oscillate around a given point
 *              with a certain amplitude and velocity.
 *
 * Return type: none
 */

var oscillator = _.merge(_.clone(StatementBloq, true), {

    name: 'oscillator',
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
        }]
    ],
    code: '{OSCILLATOR}.SetO({PHASE});{OSCILLATOR}.SetA({AMPLITUDE});{OSCILLATOR}.SetT({SPEED});{OSCILLATOR}.refresh();'
});

utils.generateBloqInputConnectors(oscillator);

module.exports = oscillator;