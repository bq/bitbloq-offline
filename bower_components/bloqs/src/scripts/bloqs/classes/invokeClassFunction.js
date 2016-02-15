/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: invokeClassFunction
 *
 * Bloq type: Statement
 *
 * Description: It execute a function, selectable from a first drop-down,
 *              which doesn't return any argument, of an specific object,
 *              selectable from a second drop-down.
 *
 * Return type: none
 */

var invokeClassFunction = _.merge(_.clone(StatementBloq, true), {

    name: 'invokeClassFunction',
    bloqClass: 'bloq-invoke-class-function',
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
        }]
    ],
    code: '{CLASS}.{FUNCTION}();',
    dynamicDropdown: {
        idDropdown: 'FUNCTION',
        options: 'voidFunctions'
    }
});

utils.generateBloqInputConnectors(invokeClassFunction);

module.exports = invokeClassFunction;