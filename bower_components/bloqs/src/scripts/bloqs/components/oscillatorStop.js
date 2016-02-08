/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: oscillatorStop
 *
 * Bloq type: Statement
 *
 * Description: It stops a specific servo, selectable from a
 *              drop-down.
 *
 * Return type: none
 */

var oscillatorStop = _.merge(_.clone(StatementBloq, true), {

    name: 'oscillatorStop',
    bloqClass: 'bloq-oscillator-stop',
    content: [
        [{
            alias: 'text',
            value: 'bloq-oscillator-stop-stop'
        }, {
            id: 'OSCILLATOR',
            alias: 'dynamicDropdown',
            options: 'oscillators'
        }]
    ],
    code: '{OSCILLATOR}.Stop();'

});
utils.generateBloqInputConnectors(oscillatorStop);

module.exports = oscillatorStop;