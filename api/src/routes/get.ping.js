'use strict';

module.exports.method = 'GET';
module.exports.route  = '/ping';
module.exports.exec   = ( req, res ) => {
    return res
        .status( 200 )
        .json( { message: 'pong' } );
};
