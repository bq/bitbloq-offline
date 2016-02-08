/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
* Bloq name: zowiIfButton
*
* Bloq type: Statement-Input
*
* Description: It executes the following code only if the one of
*              both buttons of the Zowi's back, selectable from a
*              drop-down, is pushed.
*
* Return type: none
*/

var zowiIfButtons = _.merge(_.clone(StatementInputBloq, true), {

    name: 'zowiIfButtons',
    bloqClass: 'bloq-zowi-if-buttons',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-if-buttons'
        }, {
            id: 'BUTTON',
            alias: 'staticDropdown',
            options: [{
                    label: 'bloq-zowi-if-buttons-A',
                    value: 'PIN_AButton'
                }, {
                    label: 'bloq-zowi-if-buttons-B',
                    value: 'PIN_BButton'
                }]
        }, {
            alias: 'text',
            value: 'bloq-zowi-if-buttons-then'
        },]
    ],
    code: 'if(digitalRead({BUTTON}) == 1){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(zowiIfButtons);

module.exports = zowiIfButtons;
