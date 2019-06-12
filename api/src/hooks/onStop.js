/** ****************************************************************************************************
 * File: onStop.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 26-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	MongoDB = require( '../services/mongo/MongoDB' );

module.exports = async () => {
	await MongoDB.disconnect();
};
