/** ****************************************************************************************************
 * File: create.post.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Jun-2019
 *******************************************************************************************************/
'use strict';

const
    MongoDB = require( '../../services/MongoDB' );

module.exports.method = 'POST';
module.exports.route  = '/task';
module.exports.exec   = async ( req, res ) => {
    try {
        // req.body = pioneerTask( req.body );

        const Queue = MongoDB.collections.get( 'queue' );

        let doc = new Queue( {
            _id: MongoDB.objectId(),
            config: req.body
        } );

        try {
            await doc.validate();
        }
        catch ( e ) {
            return res.status( 417 ).json( e );
        }

        doc = await doc.save();

        if ( doc ) {
            return res.status( 201 ).json( doc );
        }
        else {
            return res.status( 400 ).json( { message: 'unable to create task' } );
        }
    }
    catch ( e ) {
        return res.status( 400 ).json( { error: typeof e === 'string' ? e : e.message } );
    }
};
