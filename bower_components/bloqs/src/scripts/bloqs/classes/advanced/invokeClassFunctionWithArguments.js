/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: invokeClassFunctionWithArguments
 * 
 * Bloq type: Statement
 *
 * Description: It execute a function, selectable from a first drop-down,
 *              which doesn't return any argument, of an specific object,
 *              selectable from a second drop-down, with the given arguments.
 * 
 * Return type: none
 */

var invokeClassFunctionWithArguments = _.merge(_.clone(StatementBloq, true), {

    name: 'invokeClassFunctionWithArguments',
    bloqClass: 'bloq-invoke-class-function-args',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-class-function-exec'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'voidFunctions'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-function-class'
        }, {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'objects'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-function-args'
        }, {
            bloqInputId: 'ARGS',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{CLASS}.{FUNCTION}({ARGS});',
    dynamicDropdown: {
        idDropdown: 'FUNCTION',
        options: 'voidFunctions'
    }
});

utils.generateBloqInputConnectors(invokeClassFunctionWithArguments);

module.exports = invokeClassFunctionWithArguments;