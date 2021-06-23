'use strict';

const
    MongoDB = require( '../../services/MongoDB' );

module.exports.method = 'DELETE';
module.exports.route  = '/task/:_id';
module.exports.exec   = async ( req, res ) => {
    try {
        // validate( objectId, req.params._id );

        const
            Queue = MongoDB.collections.get( 'queue' ),
            doc   = await Queue.deleteMany( { _id: { $in: [ p.params._id ] } } );

        if ( doc.ok ) {
            if ( doc.deletedCount && doc.n === doc.deletedCount ) {
                return res.status( 202 ).json( req.body );
            }
            else {
                return res.status( 404 ).json( { message: `${ p.params._id } not found` } );
            }
        }
        else {
            return res.status( 400 ).json( doc );
        }

    }
    catch ( e ) {
        return res.status( 400 ).json( { error: typeof e === 'string' ? e : e.message } );
    }
};
