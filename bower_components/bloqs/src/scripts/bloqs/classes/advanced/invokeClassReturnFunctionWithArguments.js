/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: invokeClassReturnFunctionWithArguments
 * 
 * Bloq type: Output
 *
 * Description: It execute a function, selectable from a first drop-down,
 *              which does return an argument, of an specific object,
 *              selectable from a second drop-down, with the given arguments.
 * 
 * Return type: same type as the function's return
 */

var invokeClassReturnFunctionWithArguments = _.merge(_.clone(OutputBloq, true), {

    name: 'invokeClassReturnFunctionWithArguments',
    bloqClass: 'bloq-invoke-class-return-function',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-class-return-function-args-exec'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'returnFunctions'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-return-function-args-class'
        }, {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'objects'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-return-function-args-args'
        }, {
            bloqInputId: 'ARGS',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{CLASS}.{FUNCTION}({ARGS});',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'FUNCTION',
        options: 'returnFunctions'
    }
});

utils.generateBloqInputConnectors(invokeClassReturnFunctionWithArguments);

module.exports = invokeClassReturnFunctionWithArguments;