/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
* Bloq name: zowiIfSound
*
* Bloq type: Statement-Input
*
* Description: It executes the following code only if Zowi heards a sound.
*
* Return type: none
*/

var zowiIfSound = _.merge(_.clone(StatementInputBloq, true), {

    name: 'zowiIfSound',
    bloqClass: 'bloq-zowi-if-sound',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-if-sound'
        },]
    ],
    code: ' if(zowi.getNoise() >= 650){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(zowiIfSound);

module.exports = zowiIfSound;
