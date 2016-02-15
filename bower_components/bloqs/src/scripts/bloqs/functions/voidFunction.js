/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
 * Bloq name: voidFunction
 *
 * Bloq type: Statement-Input
 *
 * Description: It defines a function that could be later used and
 *              which does not return any value.
 *
 * Return type: none
 */

var voidFunction = _.merge(_.clone(StatementInputBloq, true), {

    name: 'voidFunction',
    bloqClass: 'bloq-void-function',
    content: [
        [{
            alias: 'text',
            value: 'bloq-void-function-declare'
        }, {
            id: 'FUNCNAME',
            alias: 'varInput',
            placeholder: 'bloq-functions-default'
        }]
    ],
    createDynamicContent: 'voidFunctions',
    returnType: {
        type: 'simple',
        value: 'void'
    },
    code: 'void {FUNCNAME} (){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(voidFunction);

module.exports = voidFunction;