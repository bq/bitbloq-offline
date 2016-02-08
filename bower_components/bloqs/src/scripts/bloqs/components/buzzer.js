/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: buzzer
 *
 * Bloq type: Statement
 *
 * Description: It turns on a specific buzzer, selectable
 *              from a first drop-down, with a basic note,
 *              selectable from a second drop-down, during
 *              a given period of time.
 *
 * Return type: none
 */

var buzzer = _.merge(_.clone(StatementBloq, true), {

    name: 'buzzer',
    bloqClass: 'bloq-buzzer',
    content: [
        [{
            alias: 'text',
            value: 'bloq-buzzer-sound'
        }, {
            id: 'BUZZER',
            alias: 'dynamicDropdown',
            options: 'buzzers'
        }, {
            alias: 'text',
            value: 'bloq-buzzer-note'
        }, {
            id: 'NOTE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-buzzer-do',
                value: '261'
            }, {
                label: 'bloq-buzzer-re',
                value: '293'
            }, {
                label: 'bloq-buzzer-mi',
                value: '329'
            }, {
                label: 'bloq-buzzer-fa',
                value: '349'
            }, {
                label: 'bloq-buzzer-sol',
                value: '392'
            }, {
                label: 'bloq-buzzer-la',
                value: '440'
            }, {
                label: 'bloq-buzzer-si',
                value: '494'
            }]
        }, {
            alias: 'text',
            value: 'bloq-buzzer-for'
        }, {
            id: 'SECONDS',
            alias: 'numberInput',
            value: 2000
        }, {
            alias: 'text',
            value: 'bloq-buzzer-ms'
        }]
    ],
    code: 'tone({BUZZER},{NOTE},{SECONDS});\ndelay({SECONDS});'
});
utils.generateBloqInputConnectors(buzzer);

module.exports = buzzer;