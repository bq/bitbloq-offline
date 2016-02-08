'use strict';

/**
* Bloq name: statement
*
* Description: It is the statement bloq's structure.
*              It has two connectors, one on top that accepts
*              only bottom type connectors, and other
*              connector on the bottom that only accepts
*              elements of top type.
*/

var statement = {

    type: 'statement',
    name: 'statement',
    connectors: [{
        type: 'connector--top',
        accept: 'connector--bottom'

    }, {
        type: 'connector--bottom',
        accept: 'connector--top'

    }]
};

module.exports = statement;