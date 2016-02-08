/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: invokeReturnFunctionWithArguments
 *
 * Bloq type: Output
 *
 * Description: It executes a function, selectable from a drop-down,
 *              which does return a value with the given arguments.
 *
 * Return type: function's return type
 */

var invokeReturnFunctionWithArguments = _.merge(_.clone(OutputBloq, true), {

    name: 'invokeReturnFunctionWithArguments',
    bloqClass: 'bloq-invoke-return-function-with-arguments',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-return-function-exec'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'returnFunctions'
        }, {
            alias: 'text',
            value: 'bloq-invoke-function-args'
        }, {
            bloqInputId: 'ARGS',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{FUNCTION}({ARGS})',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'FUNCTION',
        options: 'returnFunctions'
    }
});

utils.generateBloqInputConnectors(invokeReturnFunctionWithArguments);

module.exports = invokeReturnFunctionWithArguments;