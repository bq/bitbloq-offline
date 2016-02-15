'use strict';

/**
* Bloq name: statement-input
*
* Description: It is the statement-input bloq's structure.
*              It has three connectors, one on top that accepts
*              only bottom type connectors, other
*              connector on the bottom that only accepts
*              elements of top type and one root type
*              connector that only accepts top type connectors.
*/

var statementInput = {

    type: 'statement-input',
    name: 'statement-input',
    connectors: [{
        type: 'connector--top',
        accept: 'connector--bottom'
    }, {
        type: 'connector--bottom',
        accept: 'connector--top'
    }, {
        type: 'connector--root',
        accept: 'connector--top'
    }]
};

module.exports = statementInput;