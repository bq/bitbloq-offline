'use strict';

/**
* Bloq name: output
*
* Description: It is the output bloq's structure.
*              It has only one output type connector that accepts
*              only input type connectors.
*/

var output = {

    type: 'output',
    name: 'output',
    connectors: [{
        type: 'connector--output',
        accept: 'connector--input'
    }]
};

module.exports = output;