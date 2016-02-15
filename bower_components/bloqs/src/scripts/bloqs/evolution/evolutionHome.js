/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
* Bloq name: evolutionHome
*
* Bloq type: statement
*
* Description: It makes Evolution rest in the defect position.
*
* Return type: none
*/

var evolutionHome = _.merge(_.clone(StatementBloq, true), {

    name: 'evolutionHome',
    bloqClass: 'bloq-evolution-rest',
    content: [
        [{
            alias: 'text',
            value: 'bloq-evolution-rest'
        }]
    ],
    code: 'evolution.home();'
});
utils.generateBloqInputConnectors(evolutionHome);

module.exports = evolutionHome;