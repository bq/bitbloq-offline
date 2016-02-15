/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: invokeFunctionWithArguments
 *
 * Bloq type: Statement
 *
 * Description: It executes a function, selectable from a drop-down,
 *              which does not return any value with the given arguments.
 *
 * Return type: none
 */

var invokeFunctionWithArguments = _.merge(_.clone(StatementBloq, true), {

    name: 'invokeFunctionWithArguments',
    bloqClass: 'bloq-invoke-function-with-arguments',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-function-exec'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'voidFunctions'
        }, {
            alias: 'text',
            value: 'bloq-invoke-function-args'
        }, {
            bloqInputId: 'ARGS',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{FUNCTION}({ARGS});',
    dynamicDropdown: {
        idDropdown: 'FUNCTION',
        options: 'voidFunctions'
    }
});

utils.generateBloqInputConnectors(invokeFunctionWithArguments);

module.exports = invokeFunctionWithArguments;