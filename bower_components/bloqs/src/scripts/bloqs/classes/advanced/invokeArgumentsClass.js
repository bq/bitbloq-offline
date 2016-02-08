/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: invokeArgumentsClass
 * 
 * Bloq type: Statement
 *
 * Description: It instance an object of a specific class, selectable
 *              from a drop-down, with a given name and arguments.
 * 
 * Return type: none
 */

var invokeArgumentsClass = _.merge(_.clone(StatementBloq, true), {

    name: 'invokeArgumentsClass',
    bloqClass: 'bloq-invoke-arguments-class',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-arguments-class'
        }, {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'classes'
        }, {
            alias: 'text',
            value: 'bloq-invoke-arguments-class-name'
        }, {
            id: 'NAME',
            alias: 'varInput',
            value: ''
        }, {
            alias: 'text',
            value: 'bloq-invoke-arguments-args'
        }, {
            bloqInputId: 'ARGS',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    createDynamicContent: 'objects',

    code: '{CLASS} {NAME}({ARGS});',
    returnType: {
        type: 'simple',
        value: 'var'
    }
});

utils.generateBloqInputConnectors(invokeArgumentsClass);

module.exports = invokeArgumentsClass;