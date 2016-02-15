/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: mathOperations
 *
 * Bloq type: Output
 *
 * Description: It returns the result of the math operation over a single number.
 *
 * Return type: float
 */

var mathOperations = _.merge(_.clone(OutputBloq, true), {

    name: 'mathOperations',
    bloqClass: 'bloq-math-operations',
    content: [
        [{
            id: 'OPERATOR',
            alias: 'staticDropdown',
            //'Raíz cuadrada', 'Valor absoluto', '-', 'ln', 'log10', 'e^', '10^']
            options: [{
                label: 'bloq-math-operations-sqrt',
                value: 'sqrt'
            }, {
                label: 'bloq-math-operations-abs',
                value: 'abs'
            }, {
                label: 'ln',
                value: 'log'
            }, {
                label: 'log10',
                value: 'log10'
            }, {
                label: 'e^',
                value: 'exp'
            }]
        }, {
            bloqInputId: 'ARG',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{OPERATOR}({ARG})',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});

utils.generateBloqInputConnectors(mathOperations);

module.exports = mathOperations;