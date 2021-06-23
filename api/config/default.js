'use strict';

const
    path = require( 'path' ),
    {
        name,
        version,
        description
    }    = require( '../package' );

const env = process.env;

env.API_PID_TITLE = env.API_PID_TITLE || `${ name }-v${ version }`;
process.title     = env.API_PID_TITLE;

const config = {
    name,
    version: `v${ version }`,
    description,
    title: env.API_PID_TITLE,

    ENV: env.ENV || 'development',
    NODE_ENV: env.NODE_ENV || 'development',

    server: {
        host: env.API_HOST || '0.0.0.0',
        port: +env.API_PORT || 3000,
        routes: env.API_ROUTE_PATH || path.join( process.cwd(), 'src', 'routes' )
    },

    mongodb: {
        uri: `mongodb://${ process.env.MONGO_HOST || 'mongo' }:${ process.env.MONGO_PORT || 27017 }/pioneer`,
        ipFamily: 4,
        useNewUrlParser: true
    },

    storage: {
        path: path.join( process.cwd(), 'storage' ),
        apiRoute: '/api/storage/'
    },

    workers: {
        polling: {
            // frequency: 10000
            frequency: 1000
        }
    },

    // secret is to hold config information that should NOT be sent to the user
    secret: {}
};

module.exports = config;
