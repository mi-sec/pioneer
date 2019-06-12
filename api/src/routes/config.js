/** ****************************************************************************************************
 * File: config.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	config   = require( 'config' ),
	Response = require( 'http-response-class' ),
	{
		omit,
		findMissingKeys,
		include
	}        = require( '../utils/general' ),
	data     = omit( config, 'secret' );

module.exports.method = 'GET';
module.exports.route  = '/config';
module.exports.exec   = ( req, res ) => {
	const p = res.locals;

	if ( !p.query.key ) {
		return p.respond( new Response( 200, data ) );
	}
	else {
		if ( !Array.isArray( p.query.key ) ) {
			p.query.key = [ p.query.key ];
		}

		const missing = findMissingKeys( data, ...p.query.key );

		if ( missing.length ) {
			return p.respond( new Response( 400, `${ missing.join( ', ' ) } does not exist` ) );
		}
		else {
			return p.respond( new Response( 200, include( data, ...p.query.key ) ) );
		}
	}
};
