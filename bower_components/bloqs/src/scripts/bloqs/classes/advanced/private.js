/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: bloqPrivate
 * 
 * Bloq type: Statement-Input
 *
 * Description: It defines the private variables and functions of a class,
 *              which would not be accessible or visible from outside the class.
 * 
 * Return type: none
 */

var bloqPrivate = _.merge(_.clone(StatementInputBloq, true), {

    name: 'private',
    bloqClass: 'bloq-private',
    content: [
        [{
            alias: 'text',
            value: 'bloq-private'
        }]
    ],
    code: 'private : {STATEMENTS}',
    hCode: 'private : {STATEMENTS}',
    cppCode: ''

});

utils.generateBloqInputConnectors(bloqPrivate);

module.exports = bloqPrivate;