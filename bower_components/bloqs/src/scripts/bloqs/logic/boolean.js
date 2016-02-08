/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: boolean
 *
 * Bloq type: Output
 *
 * Description: It returns true os false, selectable from a drop-down.
 *
 * Return type: bool
 */

var boolean = _.merge(_.clone(OutputBloq, true), {

    name: 'boolean',
    bloqClass: 'bloq-boolean',
    content: [
        [{
            id: 'STATE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-boolean-true',
                value: 'true'
            }, {
                label: 'bloq-boolean-false',
                value: 'false'
            }]
        }]
    ],
    code: '{STATE}',
    returnType: {
        type: 'simple',
        value: 'bool'
    }

});

utils.generateBloqInputConnectors(boolean);

module.exports = boolean;