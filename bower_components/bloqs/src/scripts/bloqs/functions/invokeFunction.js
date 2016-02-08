/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: invokeFunction
 *
 * Bloq type: Statement
 *
 * Description: It executes a function, selectable from a drop-down,
 *              which does not return any value.
 *
 * Return type: none
 */

var invokeFunction = _.merge(_.clone(StatementBloq, true), {

    name: 'invokeFunction',
    bloqClass: 'bloq-invoke-function',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-function-exec'
        }, {
            id: 'FUNCTION',
            alias: 'dynamicDropdown',
            options: 'voidFunctions'
        }]
    ],
    code: '{FUNCTION}();',
    dynamicDropdown: {
        idDropdown: 'FUNCTION',
        options: 'voidFunctions'
    }
});

utils.generateBloqInputConnectors(invokeFunction);

module.exports = invokeFunction;