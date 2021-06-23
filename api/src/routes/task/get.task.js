/** ****************************************************************************************************
 * File: task.get.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Jun-2019
 *******************************************************************************************************/
'use strict';

const
    MongoDB = require( '../../services/MongoDB' );

module.exports.method = 'GET';
module.exports.route  = [
    '/task',
    '/task/:summary(summary)',
    '/task/:_id',
    '/task/:_id/:summary(summary)'
];
module.exports.exec   = async ( req, res ) => {
    try {
        // if ( req.params._id ) {
        //     await validate( objectId, req.params._id );
        // }

        const
            Queue = MongoDB.collections.get( 'queue' );

        let doc;

        if ( req.params._id ) {
            doc = Queue.findById( req.params._id );
        }
        else {
            doc = Queue.find();
        }

        if ( req.params.summary ) {
            doc = doc.select( '-data' );
        }

        doc = await doc.exec();

        if ( doc ) {
            return res.status( 200 ).json( doc );
        }
        else {
            return res.status( 404 ).json( { message: `${ req.params._id } not found` } );
        }
    }
    catch ( e ) {
        return res.status( 400 ).json( { error: typeof e === 'string' ? e : e.message } );
    }
};
