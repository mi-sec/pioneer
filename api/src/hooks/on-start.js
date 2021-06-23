'use strict';

const
    config           = require( 'config' ),
    { promises: fs } = require( 'fs' ),
    logger           = require( '../services/logger' ),
    MongoDB          = require( '../services/MongoDB' ),
    { waitFor }      = require( '../utils/general' );

module.exports = async () => {
    logger.trace( 'application on-start' );

    const assetPath = config.get( 'storage.assets' );
    const storagePath = config.get( 'storage.path' );

    // ensure the local asset storage path exists
    try {
        await fs.access( assetPath );
    }
    catch {
        await fs.mkdir( assetPath, { recursive: true } );
    }

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
