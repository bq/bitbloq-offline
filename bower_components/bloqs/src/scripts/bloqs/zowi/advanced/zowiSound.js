/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: zowiSound
 *
 * Bloq type: Output
 *
 * Description: It returns the noise that Zowi hears.
 *
 * Return type: float
 */

var zowiSound = _.merge(_.clone(OutputBloq, true), {

    name: 'zowiSound',
    bloqClass: 'bloq-zowi-sound',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-sound'
        }]
    ],
    code: 'zowi.getNoise()',
    returnType: {
        type: 'simple',
        value: 'float'
    }
});
utils.generateBloqInputConnectors(zowiSound);

module.exports = zowiSound;