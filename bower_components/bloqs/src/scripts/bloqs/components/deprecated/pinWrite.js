/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: pinWriteAdvanced
 * 
 * Bloq type: Statement
 *
 * Description: It writes in a specific pin the given data.
 * 
 * Return type: none
 */

var pinWriteAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'pinWriteAdvanced',
    bloqClass: 'bloq-pin-writte-advanced',
    content: [
        [{
            alias: 'text',
            value: 'bloq-pin-writte-advanced-writepin'
        }, {
            bloqInputId: 'PIN',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-pin-writte-advanced-data'
        }, {
            bloqInputId: 'DATA',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '\'{PIN}\'.indexOf(\'A\') === 0 ? \'analogWrite({PIN},{DATA});\' : \'digitalWrite({PIN},{DATA});\''

});

utils.generateBloqInputConnectors(pinWriteAdvanced);


module.exports = pinWriteAdvanced;