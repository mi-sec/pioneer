/** ****************************************************************************************************
 * File: remove.delete.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	MongoDB  = require( '../../services/mongo/MongoDB' ),
	{
		validate,
		objectId
	}        = require( '../../services/superstructs' );

module.exports.method = 'DELETE';
module.exports.route  = '/task/:_id';
module.exports.exec   = async ( req, res ) => {
	const p = res.locals;

	try {
		validate( objectId, p.params._id );

		const
			Queue = MongoDB.collections.get( 'queue' ),
			doc   = await Queue.deleteMany( { _id: { $in: [ p.params._id ] } } );

		if ( doc.ok ) {
			if ( doc.deletedCount && doc.n === doc.deletedCount ) {
				return p.respond( new Response( 202, p.data ) );
			}
			else {
				return p.respond( new Response( 404, `${ p.params._id } not found` ) );
			}
		}
		else {
			return p.respond( new Response( 400, doc ) );
		}

	} catch ( e ) {
		return e instanceof Response ?
			p.respond( e ) :
			p.respond( new Response( e.statusCode || 500, e.data || e.stack || e.message || e ) );
	}
};
