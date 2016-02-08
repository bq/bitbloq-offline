 /*global require */
 'use strict';

 var _ = require('lodash'),
     utils = require('./../build-utils'),
     GroupBloq = require('./../groupBloq');

 /**
  * Bloq name: varsBloq
  *
  * Bloq type: group
  *
  * Description: It is used to declare and initialize variables,
  *              functions, classes, etc. which would be used on
  *              the other two mainBloqs.
  *
  * Return type: none
  */

 var varsBloq = _.merge(_.clone(GroupBloq, true), {

     name: 'varsBloq',
     bloqClass: 'bloq-vars',
     headerText: 'bloq-var-header',
     descriptionText: 'bloq-var-description',
     content: [],
     code: '{STATEMENTS}'
 });

 utils.generateBloqInputConnectors(varsBloq);


 module.exports = varsBloq;