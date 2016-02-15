/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: invokeClassReturnFunction
 *
 * Bloq type: Output
 *
 * Description: It execute a function, selectable from a first drop-down,
 *              which does return an argument, of an specific object,
 *              selectable from a second drop-down.
 *
 * Return type: same type as the function's return
 */

var invokeClassReturnFunction = _.merge(_.clone(OutputBloq, true), {

    name: 'invokeClassReturnFunction',
    bloqClass: 'bloq-invoke-class-return-function',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-class-return-function-exec'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'returnFunctions'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-function-class'
        }, {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'objects'
        }]
    ],

    code: '{CLASS}.{FUNCTION}()',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'FUNCTION',
        options: 'returnFunctions'
    }
});

utils.generateBloqInputConnectors(invokeClassReturnFunction);

module.exports = invokeClassReturnFunction;