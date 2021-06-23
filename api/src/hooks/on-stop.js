'use strict';

const
    logger  = require( '../services/logger' ),
    MongoDB = require( '../services/MongoDB' );

module.exports = async () => {
    logger.trace( 'application on-stop' );

    await MongoDB.disconnect();
};
