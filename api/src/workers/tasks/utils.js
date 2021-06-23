/** ****************************************************************************************************
 * File: utils.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Jun-2019
 *******************************************************************************************************/
'use strict';

let id = 0;

function getId() {
    return id++;
}

module.exports = {
    getId
};
