 /*global require */
 'use strict';

 var _ = require('lodash'),
     utils = require('./../build-utils'),
     GroupBloq = require('./../groupBloq');

 /**
  * Bloq name: loopBloq
  *
  * Bloq type: group
  *
  * Description: It is used to storage the bloqs wanted
  *              to be executed repeatedly infinitely.
  *
  * Return type: none
  */

 var loopBloq = _.merge(_.clone(GroupBloq, true), {

     name: 'loopBloq',
     bloqClass: 'bloq-loop',
     headerText: 'bloq-loop-header',
     descriptionText: 'bloq-loop-description',
     content: [],
     code: 'void loop(){{STATEMENTS}}'

 });

 utils.generateBloqInputConnectors(loopBloq);


 module.exports = loopBloq;