/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: zowiSounds
 *
 * Bloq type: statement
 *
 * Description: It makes Zowi reproduce a specific sound,
 *              selectable from a drop-down.
 *
 * Return type: none
 */

var zowiSounds = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiSounds',
    bloqClass: 'bloq-zowi-sounds',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-sounds'
        }, {
            id: 'SOUND',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-sounds-surprise',
                value: 'S_surprise'
            }, {
                label: 'bloq-zowi-sounds-OhOoh',
                value: 'S_OhOoh'
            }, {
                label: 'bloq-zowi-sounds-cuddly',
                value: 'S_cuddly'
            }, {
                label: 'bloq-zowi-sounds-sleeping',
                value: 'S_sleeping'
            }, {
                label: 'bloq-zowi-sounds-happy',
                value: 'S_happy'
            }, {
                label: 'bloq-zowi-sounds-sad',
                value: 'S_sad'
            }, {
                label: 'bloq-zowi-sounds-confused',
                value: 'S_confused'
            }, {
                label: 'bloq-zowi-sounds-fart1-v1',
                value: 'S_fart1'
            }]
        }]
    ],
    code: 'zowi.sing({SOUND});'
});
utils.generateBloqInputConnectors(zowiSounds);

module.exports = zowiSounds;