/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: buzzerAdvanced
 * 
 * Bloq type: Statement
 *
 * Description: It turns on a specific buzzer with a given note
 *              during a determined period of time.
 * 
 * Return type: none
 */

var buzzerAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'buzzerAdvanced',
    bloqClass: 'bloq-buzzer-advance',
    content: [
        [{
            alias: 'text',
            value: 'bloq-buzzer-advance-sound'
        }, {
            bloqInputId: 'BUZZER',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-buzzer-advance-note'
        }, {
            bloqInputId: 'NOTE',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-buzzer-advance-for'
        }, {
            bloqInputId: 'SECONDS',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-buzzer-advance-ms'
        }]
    ],
    code: 'tone({BUZZER},{NOTE},{SECONDS});\ndelay({SECONDS});'
});
utils.generateBloqInputConnectors(buzzerAdvanced);

module.exports = buzzerAdvanced;