/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: invokeReturnFunction
 *
 * Bloq type: Output
 *
 * Description: It executes a function, selectable from a drop-down,
 *              which does return a value.
 *
 * Return type: function's return type
 */

var invokeReturnFunction = _.merge(_.clone(OutputBloq, true), {

    name: 'invokeReturnFunction',
    bloqClass: 'bloq-invoke-return-function',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-return-function-exec'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'returnFunctions'
        }]
    ],

    code: '{FUNCTION}()',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'FUNCTION',
        options: 'returnFunctions'
    }
});

utils.generateBloqInputConnectors(invokeReturnFunction);

module.exports = invokeReturnFunction;