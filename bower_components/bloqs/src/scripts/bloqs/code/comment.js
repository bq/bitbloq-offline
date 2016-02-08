/*global require */
'use strict';

var _ = require('lodash');
var StatementBloq = require('./../statementBloq');

/**
* Bloq name: code
* 
* Bloq type: Statement
*
* Description: It gives the space to write a comment in the code.
* 
* Return type: none
*/

var comment = _.merge(_.clone(StatementBloq, true), {

    name: 'comment',
    bloqClass: 'bloq-comment',
    content: [
        [{
            alias: 'text',
            value: 'bloq-comment-comment'
        }, {
            id: 'COMMENT',
            alias: 'multilineCommentInput',
            placeholder:'bloq-comment-default'
        }]
    ],
    code: '/*\n{COMMENT}\n*/'
});

module.exports = comment;