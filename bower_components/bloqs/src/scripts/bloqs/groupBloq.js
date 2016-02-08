'use strict';

/**
* Bloq name: group
*
* Description: It is the group bloq's structure.
*              It has only one root type connector
*              that only accepts top type connectors.
*/

var group = {

    name: 'group',
    type: 'group',
    connectors: [{
        type: 'connector--empty'
    }, {
        type: 'connector--empty'
    }, {
        type: 'connector--root',
        accept: 'connector--top'
    }]
};

module.exports = group;