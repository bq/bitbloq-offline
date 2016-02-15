/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: voidFunctionWithArguments
 *
 * Bloq type: Statement-Input
 *
 * Description: It defines a function with the given arguments that could be
 *              later used and which does not return any value.
 *
 * Return type: none
 */

var voidFunctionWithArguments = _.merge(_.clone(StatementInputBloq, true), {

    name: 'voidFunctionWithArguments',
    bloqClass: 'bloq-void-function-with-arguments',
    content: [
        [{
            alias: 'text',
            value: 'bloq-void-function-with-arguments-declare'
        }, {
            id: 'FUNCNAME',
            alias: 'varInput',
            placeholder: 'bloq-functions-default'
        }, {
            alias: 'text',
            value: 'bloq-void-function-with-arguments-count'
        }, {
            bloqInputId: 'ARGS',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    createDynamicContent: 'voidFunctions',
    returnType: {
        type: 'simple',
        value: 'void'
    },
    arguments: {
        type: 'fromInput',
        bloqInputId: 'ARGS'
    },
    code: 'void {FUNCNAME} ({ARGS}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(voidFunctionWithArguments);

module.exports = voidFunctionWithArguments;