/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: return
 *
 * Bloq type: statement
 *
 * Description: It terminates the function making the function
 *              to return what is given.
 *
 * Return type: none
 */

var bloqReturn = _.merge(_.clone(StatementBloq, true), {

    name: 'return',
    bloqClass: 'bloq-return',
    content: [
        [{
            alias: 'text',
            value: 'bloq-return-return'
        }, {
            bloqInputId: 'RETURN',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: 'return {RETURN};'
});

utils.generateBloqInputConnectors(bloqReturn);

module.exports = bloqReturn;