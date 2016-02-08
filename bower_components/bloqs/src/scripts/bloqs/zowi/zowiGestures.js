/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: zowiGestures
 *
 * Bloq type: statement
 *
 * Description: It makes Zowi express a specific emotion,
 *              selectable from a drop-down.
 *
 * Return type: none
 */

var zowiGestures = _.merge(_.clone(StatementBloq, true), {

    name: 'zowiGestures',
    bloqClass: 'bloq-zowi-gestures',
    content: [
        [{
            alias: 'text',
            value: 'bloq-zowi-gestures'
        }, {
            id: 'GESTURE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-zowi-gestures-ZowiHappy',
                value: 'ZowiHappy'
            }, {
                label: 'bloq-zowi-gestures-ZowiSuperHappy',
                value: 'ZowiSuperHappy'
            }, {
                label: 'bloq-zowi-gestures-ZowiSad',
                value: 'ZowiSad'
            }, {
                label: 'bloq-zowi-gestures-ZowiSleeping',
                value: 'ZowiSleeping'
            }, {
                label: 'bloq-zowi-gestures-ZowiFart',
                value: 'ZowiFart'
            }, {
                label: 'bloq-zowi-gestures-ZowiConfused',
                value: 'ZowiConfused'
            }, {
                label: 'bloq-zowi-gestures-ZowiLove',
                value: 'ZowiLove'
            }, {
                label: 'bloq-zowi-gestures-ZowiAngry',
                value: 'ZowiAngry'
            }, {
                label: 'bloq-zowi-gestures-ZowiFretful',
                value: 'ZowiFretful'
            }, {
                label: 'bloq-zowi-gestures-ZowiVictory',
                value: 'ZowiVictory'
            }, {
                label: 'bloq-zowi-gestures-ZowiFail',
                value: 'ZowiFail'
            }]
        }]
    ],
    code: 'zowi.playGesture({GESTURE});'
});
utils.generateBloqInputConnectors(zowiGestures);

module.exports = zowiGestures;