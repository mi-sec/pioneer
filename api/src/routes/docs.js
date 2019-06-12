/** ****************************************************************************************************
 * @file: docs.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';

const
	config   = require( 'config' ),
	Response = require( 'http-response-class' );

module.exports.method = 'GET';
module.exports.route  = '/docs';
module.exports.exec   = ( req, res ) => {
	const
		p         = res.locals,
		routePath = config.get( 'server.routes' ),
		data      = module.parent.children
			.filter( ( { id } ) => id.startsWith( routePath ) )
			.map( ( { exports } ) => ( {
				method: exports.method,
				route: exports.route
			} ) );

	return p.respond( new Response( 200, data ) );
};
