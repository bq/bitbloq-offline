/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: bloqPublic
 * 
 * Bloq type: Statement-Input
 *
 * Description: It defines the public variables and functions of a class,
 *              which would be accessible or visible anywhere outside the class.
 * 
 * Return type: none
 */

var bloqPublic = _.merge(_.clone(StatementInputBloq, true), {

    name: 'public',
    bloqClass: 'bloq-public',
    content: [
        [{
            alias: 'text',
            value: 'bloq-public'
        }]
    ],
    code: 'public : {STATEMENTS}',
    hCode: 'public : {STATEMENTS}',
    cppCode: ''

});

utils.generateBloqInputConnectors(bloqPublic);

module.exports = bloqPublic;