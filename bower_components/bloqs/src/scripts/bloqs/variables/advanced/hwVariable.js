/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: hwVariable
 *
 * Bloq type: Output
 *
 * Description: It returns the pin where a specific component,
 *              selectable from a drop down, is connected.
 *
 * Return type: selected component's type
 */

var hwVariable = _.merge(_.clone(OutputBloq, true), {

    name: 'hwVariable',
    bloqClass: 'bloq-hw-variable-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-hw-variable-advanced-variable'
        }, {
            id: 'COMPONENT',
            alias: 'dynamicDropdown',
            options: 'varComponents'
        }]
    ],
    code: '{COMPONENT}',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'COMPONENT',
        options: 'varComponents'
    }
});

utils.generateBloqInputConnectors(hwVariable);

module.exports = hwVariable;