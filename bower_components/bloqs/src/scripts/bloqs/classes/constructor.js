/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
 * Bloq name: constructorClass
 *
 * Bloq type: Statement-Input
 *
 * Description: It defines de constructor of a class, which would be executed
 *              when the class was instanced into an object. It is used to
 *              initialize the variables of the class.
 *
 * Return type: none
 */

var constructorClass = _.merge(_.clone(StatementInputBloq, true), {

    name: 'constructorClass',
    bloqClass: 'bloq-constructor',
    content: [
        [{
            alias: 'text',
            value: 'bloq-constructor'
        }]
    ],
    code: '{CLASS-OUTSIDE}(){{STATEMENTS}};',
    hCode: '{CLASS-OUTSIDE} ();',
    cppCode: '{CLASS-OUTSIDE} :: {CLASS-OUTSIDE} (){{STATEMENTS}};'

});

utils.generateBloqInputConnectors(constructorClass);

module.exports = constructorClass;