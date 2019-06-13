/** ****************************************************************************************************
 * File: create.post.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	MongoDB  = require( '../../services/mongo/MongoDB' ),
	{
		validate,
		pioneerTask
	}        = require( '../../services/superstructs' );

module.exports.method = 'POST';
module.exports.route  = '/task';
module.exports.exec   = async ( req, res ) => {
	const p = res.locals;

	try {
		p.data = pioneerTask( p.data );

		const Queue = MongoDB.collections.get( 'queue' );

		let doc = new Queue( {
			_id: MongoDB.objectId(),
			config: p.data
		} );

		try {
			await doc.validate();
		} catch ( e ) {
			return p.respond( new Response( 417, e ) );
		}

		doc = await doc.save();

		if ( doc ) {
			return p.respond( new Response( 201, doc ) );
		}
		else {
			return p.respond( new Response( 400, 'unable to create task' ) );
		}
	} catch ( e ) {
		return e instanceof Response ?
			p.respond( e ) :
			p.respond( new Response( e.statusCode || 500, e.data || e.stack || e.message || e ) );
	}
};
