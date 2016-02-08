/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: zowiHome
 *
 * Bloq type: statement
 *
 * Description: It makes Zowi rest in the defect position.
 *
 * Return type: none
 */

var zowiHome = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiHome',
    bloqClass: 'bloq-zowi-rest',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-rest'
        }]
    ],
    code: 'zowi.home();'
});
utils.generateBloqInputConnectors(zowiHome);

module.exports = zowiHome;