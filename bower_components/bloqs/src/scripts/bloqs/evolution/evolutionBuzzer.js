/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
* Bloq name: evolutionBuzzer
* 
* Bloq type: Statement
*
* Description: It turns on the buzzer of Evolution with a basic note, 
*              selectable from a drop-down, during a given period of time.
* 
* Return type: none
*/

var evolutionBuzzer = _.merge(_.clone(StatementBloq, true), {

    name: 'evolutionBuzzer',
    bloqClass: 'bloq-evolution-buzzer',
    content: [
        [{
            alias: 'text',
            value: 'bloq-evolution-buzzer'
        }, {
            id: 'NOTE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-evolution-buzzer-do',
                value: 'note_C4'
            }, {
                label: 'bloq-evolution-buzzer-re',
                value: 'note_D4'
            }, {
                label: 'bloq-evolution-buzzer-mi',
                value: 'note_E4'
            }, {
                label: 'bloq-evolution-buzzer-fa',
                value: 'note_F4'
            }, {
                label: 'bloq-evolution-buzzer-sol',
                value: 'note_G4'
            }, {
                label: 'bloq-evolution-buzzer-la',
                value: 'note_A4'
            }, {
                label: 'bloq-evolution-buzzer-si',
                value: 'note_B4'
            }]
        }, {
            alias: 'text',
            value: 'bloq-evolution-buzzer-for'
        }, {
            id: 'SECONDS',
            alias: 'numberInput',
            value: 1000
        }, {
            alias: 'text',
            value: 'bloq-evolution-buzzer-ms'
        }]
    ],
    code: 'evolution._tone({NOTE},{SECONDS});'
});
utils.generateBloqInputConnectors(evolutionBuzzer);

module.exports = evolutionBuzzer;