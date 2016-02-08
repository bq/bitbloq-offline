/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: hts221Humidity
 *
 * Bloq type: Output
 *
 * Description: It returns the humidity measurement from a
 *              specific humidity & temperature sensor, selectable
 *              from a drop-down.
 *
 * Return type: float
 */

var hts221Humidity = _.merge(_.clone(OutputBloq, true), {

    name: 'hts221Humidity',
    bloqClass: 'bloq-hts221-humidity',
    content: [
        [{
            alias: 'text',
            value: 'bloq-hts221-humidity'
        }, {
            id: 'SENSOR',
            alias: 'dynamicDropdown',
            options: 'hts221'
        }]
    ],
    code: '{SENSOR}.getHumidity()',
    returnType: {
        type: 'simple',
        value: 'float'
    }

});

utils.generateBloqInputConnectors(hts221Humidity);

module.exports = hts221Humidity;