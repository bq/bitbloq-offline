/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: selectVariable
 *
 * Bloq type: Output
 *
 * Description: It returns a specific variable, selectable from a drop-down.
 *
 * Return type: selected variable's type
 */

var selectVariable = _.merge(_.clone(OutputBloq, true), {

    name: 'selectVariable',
    bloqClass: 'bloq-select-variable',
    content: [
        [{
            alias: 'text',
            value: 'bloq-select-variable-variable'
        }, {
            id: 'VAR',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }]
    ],
    code: '{VAR}',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'VAR',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(selectVariable);

module.exports = selectVariable;