'use strict';

const
    config           = require( 'config' ),
    { promises: fs } = require( 'fs' ),
    logger           = require( '../services/logger' ),
    MongoDB          = require( '../services/MongoDB' ),
    { waitFor }      = require( '../utils/general' );

module.exports = async () => {
    logger.trace( 'application on-start' );

    const storagePath = config.get( 'storage.path' );

    // ensure the local storage path exists
    try {
        await fs.access( storagePath );
    }
    catch {
        await fs.mkdir( storagePath, { recursive: true } );
    }

    await waitFor( async () => {
        logger.trace( 'waiting for mongo connection' );

        try {
            await MongoDB.connect();
        }
        finally {
            logger.trace( 'waiting for mongo connection' );
        }

        return MongoDB.isConnected();
    }, 200, true );

    logger.trace( 'mongo connected' );
};
