/*--IN PROGRESS--*/

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: enableInterrupt
 *
 * Bloq type: Statement
 *
 * Description: It enables the hardware interrupt of the board
 *              for rising, falling or both changes, assigning
 *              it a given function which would be executed when
 *              it happened.
 *
 * Return type: none
 */

var enableInterrupt = _.merge(_.clone(StatementBloq, true), {

    name: 'enableInterrupt',
    bloqClass: 'bloq-enable-interrupt',
    content: [
        [{
            alias: 'text',
            value: 'bloq-enable-interrupt'
        }, {
            id: 'FUNC',
            alias: 'dynamicDropdown',
            options: 'voidFunctions'
        }, {
            alias: 'text',
            value: 'bloq-enable-interrupt-pin'
        }, {
            id: 'PIN',
            alias: 'dynamicDropdown',
            options: 'varComponents'
        }, {

            id: 'STATE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-enable-interrupt-rising',
                value: 'RISING'
            }, {
                label: 'bloq-enable-interrupt-falling',
                value: 'FALLING'
            }, {
                label: 'bloq-enable-interrupt-change',
                value: 'CHANGE'
            }]
        }]
    ],
    code: 'enableInterrupt({PIN}, {FUNC}, {STATE});'

});

utils.generateBloqInputConnectors(enableInterrupt);

module.exports = enableInterrupt;