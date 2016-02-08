/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: invokeClass
 *
 * Bloq type: Statement
 *
 * Description: It instance an object of a specific class, selectable
 *              from a drop-down, with a given name.
 *
 * Return type: none
 */

var invokeClass = _.merge(_.clone(StatementBloq, true), {

    name: 'invokeClass',
    bloqClass: 'bloq-invoke-class',
    content: [
        [{
            alias: 'text',
            value: 'bloq-invoke-class'
        }, {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'classes'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-name'
        }, {
            id: 'NAME',
            alias: 'varInput',
            value: ''
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-function-class'
        }, {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'classes'
        }]
    ],
    createDynamicContent: 'objects',

    code: '{CLASS} {NAME};',
    returnType: {
        type: 'simple',
        value: 'var'
    }
});

utils.generateBloqInputConnectors(invokeClass);

module.exports = invokeClass;