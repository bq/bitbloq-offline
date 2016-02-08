/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: bloqProtected
 * 
 * Bloq type: Statement-Input
 *
 * Description: It defines the protected variables and functions of a class,
 *              which would not be accessible or visible from outside the class,
 *              excepting derived classes.
 * 
 * Return type: none
 */

var bloqProtected = _.merge(_.clone(StatementInputBloq, true), {

    name: 'protected',
    bloqClass: 'bloq-protected',
    content: [
        [{
            alias: 'text',
            value: 'bloq-protected'
        }]
    ],
    code: 'protected : {STATEMENTS}',
    hCode: 'protected : {STATEMENTS}',
    cppCode: ''
});

utils.generateBloqInputConnectors(bloqProtected);

module.exports = bloqProtected;