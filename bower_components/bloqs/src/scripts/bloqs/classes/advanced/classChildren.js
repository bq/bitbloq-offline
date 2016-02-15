/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: classChildren
 * 
 * Bloq type: Statement-Input
 *
 * Description: It defines a class which inherits, in a public, protected
 *              or private way, selectable from a first drop-down, the
 *              variables and functions from another class, selectable from
 *              a second drop-down.
 * 
 * Return type: none
 */

var classChildren = _.merge(_.clone(StatementInputBloq, true), {

    name: 'classChildren',
    bloqClass: 'bloq-class-children',
    content: [
        [{
            alias: 'text',
            value: 'bloq-class'
        }, {
            id: 'NAME',
            alias: 'varInput',
            placeholder: 'bloq-class-default'
        }, {
            alias: 'text',
            value: 'bloq-class-inheritance-type'
        }, {
            id: 'TYPE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-class-inheritance-public',
                value: 'public'
            }, {
                label: 'bloq-class-inheritance-protected',
                value: 'protected'
            }, {
                label: 'bloq-class-inheritance-private',
                value: 'private'
            }]
        }, {
            alias: 'text',
            value: 'bloq-class-from'
        }, {
            id: 'PARENT',
            alias: 'dynamicDropdown',
            options: 'classes'
        }]
    ],
    createDynamicContent: 'classes',
    code: 'class {NAME} : public {PARENT}{{STATEMENTS}};',
    hCode: 'class {NAME}: public {PARENT}{{STATEMENTS}};',
    cppCode: '',
    returnType: {
        type: 'simple',
        value: 'class'
    }

});

utils.generateBloqInputConnectors(classChildren);

module.exports = classChildren;