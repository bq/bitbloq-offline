/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: swVariable
 *
 * Bloq type: Output
 *
 * Description: It returns a specific variable, selectable from a drop-down.
 *
 * Return type: selected variable's type
 */

var swVariable = _.merge(_.clone(OutputBloq, true), {

    name: 'swVariable',
    bloqClass: 'bloq-sw-variable-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-sw-variable-advanced-variable'
        }, {
            id: 'VALUE',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }]
    ],
    code: '{VALUE}',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'VAR',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(swVariable);

module.exports = swVariable;