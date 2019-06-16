/** ****************************************************************************************************
 * File: task.get.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	MongoDB  = require( '../../services/mongo/MongoDB' ),
	{
		validate,
		objectId
	}        = require( '../../services/superstructs' );

module.exports.method = 'GET';
module.exports.route  = [
	'/task',
	'/task/:summary(summary)',
	'/task/:_id',
	'/task/:_id/:summary(summary)'
];
module.exports.exec   = async ( req, res ) => {
	const p = res.locals;

	try {
		if ( p.params._id ) {
			await validate( objectId, p.params._id );
		}

		const
			Queue = MongoDB.collections.get( 'queue' );

		let doc = null;

		if ( p.params._id ) {
			doc = Queue.findById( p.params._id );
		}
		else {
			doc = Queue.find();
		}

		if ( p.params.summary ) {
			doc = doc.select( '-data' );
		}

		doc = await doc.exec();

		if ( doc ) {
			return p.respond( new Response( 200, doc ) );
		}
		else {
			return p.respond( new Response( 404, `${ p.params._id } not found` ) );
		}
	} catch ( e ) {
		return e instanceof Response ?
			p.respond( e ) :
			p.respond( new Response( e.statusCode || 500, e.data || e.stack || e.message || e ) );
	}
};
