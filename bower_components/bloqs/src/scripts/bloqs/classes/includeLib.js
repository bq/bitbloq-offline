/*--IN PROGRESS--*/

/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: includeLib
 *
 * Bloq type: Statement
 *
 * Description: It includes a library to use its classes, constants,
 *              variables or functions.
 *
 * Return type: none
 */

var includeLib = _.merge(_.clone(StatementBloq, true), {

    name: 'includeLib',
    bloqClass: 'bloq-include-lib',
    content: [
        [{
            alias: 'text',
            value: 'bloq-include-lib-exec'
        }, {
            id: 'LIB',
            alias: 'dynamicDropdown',
            options: 'libraries'
        }]
    ],
    code: '#include "{LIB}";'
});

utils.generateBloqInputConnectors(includeLib);

module.exports = includeLib;