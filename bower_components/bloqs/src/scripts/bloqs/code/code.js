/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: code
 *
 * Bloq type: Statement
 *
 * Description: It gives the space to write Arduino code.
 *
 * Return type: none
 */

var code = _.merge(_.clone(StatementBloq, true), {

    name: 'code',
    bloqClass: 'bloq-code',
    content: [
        [{
            id: 'CODE',
            alias: 'multilineCodeInput',
            value: '',
            placeholder: 'bloq-code-writeYourCode'
        }]
    ],
    code: '{CODE}\n'
});
utils.generateBloqInputConnectors(code);
module.exports = code;