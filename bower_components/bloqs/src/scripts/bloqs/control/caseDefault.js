/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
 * Bloq name: caseDefault
 *
 * Bloq type: Statement-Input
 *
 * Description: It executes the following code only if the variable
 *              compared in the switch bloq is not equal to any of
 *              the previous given values.
 *
 * Return type: none
 */

var caseDefault = _.merge(_.clone(StatementInputBloq, true), {

    name: 'caseDefault',
    bloqClass: 'bloq-case-default',
    content: [
        [{
            alias: 'text',
            value: 'bloq-case-default-inOtherCase'
        }]
    ],
    code: 'default:{{STATEMENTS}break;}'

});

utils.generateBloqInputConnectors(caseDefault);

module.exports = caseDefault;