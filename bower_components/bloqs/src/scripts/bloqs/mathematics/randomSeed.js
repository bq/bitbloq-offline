/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: randomSeed
 *
 * Bloq type: Statement
 *
 * Description: It inizializes the random number generator.
 *
 * Return type: none
 */

var randomSeed = _.merge(_.clone(StatementBloq, true), {

    name: 'randomSeed',
    bloqClass: 'bloq-random-seed',
    content: [
        [{
            alias: 'text',
            value: 'bloq-random-seed'
        }]
    ],
    code: 'randomSeed(micros());',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(randomSeed);

module.exports = randomSeed;