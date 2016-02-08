/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: constructorClassArguments
 * 
 * Bloq type: Statement-Input
 *
 * Description: It defines de constructor with arguments of a class, which
 *              would be executed when the class was instanced into an object.
 *              It is used to initialize the variables of the class.
 * 
 * Return type: none
 */

var constructorClassArguments = _.merge(_.clone(StatementInputBloq, true), {

    name: 'constructorClassArguments',
    bloqClass: 'bloq-constructor-arguments',
    content: [
        [{
            alias: 'text',
            value: 'bloq-constructor-arguments'
        }, {
            bloqInputId: 'ARGS',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{CLASS-OUTSIDE} ({ARGS}){{STATEMENTS}};',
    hCode: '{CLASS-OUTSIDE} ({ARGS});',
    cppCode: '{CLASS-OUTSIDE} :: {CLASS-OUTSIDE} ({ARGS}){{STATEMENTS}};'
});

utils.generateBloqInputConnectors(constructorClassArguments);

module.exports = constructorClassArguments;