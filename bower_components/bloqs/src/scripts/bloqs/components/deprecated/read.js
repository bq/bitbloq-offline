/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: readSensorAdvanced
 * 
 * Bloq type: Output
 *
 * Description: It returns the measurement of a specific sensor.
 * 
 * Return type: sensor's return type
 */

var readSensorAdvanced = _.merge(_.clone(OutputBloq, true), {

    name: 'readSensorAdvanced',
    bloqClass: 'bloq-read-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-read-advanced-read'
        }, {
            bloqInputId: 'PIN',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    // code: '\'{PIN}\'.indexOf(\'A\') === 0 ? \'analogRead({PIN})\' : \'digitalRead({PIN})\''
    code: '{SENSOR.type}',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'SENSOR',
        options: 'sensors'
    }
});

utils.generateBloqInputConnectors(readSensorAdvanced);

module.exports = readSensorAdvanced;