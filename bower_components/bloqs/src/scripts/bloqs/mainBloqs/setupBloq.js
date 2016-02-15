 /*global require */
 'use strict';

 var _ = require('lodash'),
     utils = require('./../build-utils'),
     GroupBloq = require('./../groupBloq');

 /**
  * Bloq name: setupBloq
  *
  * Bloq type: group
  *
  * Description: It is used to storage the bloqs wanted
  *              to be executed only once at the beginning
  *              of the program.
  *
  * Return type: none
  */

 var setupBloq = _.merge(_.clone(GroupBloq, true), {

     name: 'setupBloq',
     bloqClass: 'bloq-setup',
     headerText: 'bloq-setup-header',
     descriptionText: 'bloq-setup-description',
     content: [],
     code: 'void setup(){{STATEMENTS}}'
 });

 utils.generateBloqInputConnectors(setupBloq);


 module.exports = setupBloq;