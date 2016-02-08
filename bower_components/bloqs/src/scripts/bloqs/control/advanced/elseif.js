/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: elseifAdvanced
 *
 * Bloq type: Statement-Input
 *
 * Description: It executes the following code only if the previous conditions
 *              are not true and the new one does.
 *
 * Return type: none
 */

var elseifAdvanced = _.merge(_.clone(StatementInputBloq, true), {

    name: 'elseifAdvanced',
    bloqClass: 'bloq-else-if',
    content: [
        [{
            alias: 'text',
            value: 'bloq-else-if-if'
        }, {
            bloqInputId: 'VAR',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-else-if-else'
        }]
    ],
    code: 'else if ({VAR}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(elseifAdvanced);

module.exports = elseifAdvanced;