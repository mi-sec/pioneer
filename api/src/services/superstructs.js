/** ****************************************************************************************************
 * @file: structs.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Aug-2018
 *******************************************************************************************************/
'use strict';

const
    { superstruct } = require( 'superstruct' ),
    {
        isValidURL,
        isObjectId
    }               = require( '../utils/general' );

const
    types  = {
        hostname: d => isValidURL( d ),
        objectId: d => isObjectId( d ),
        stringNumber: d => +d === d,
        map: d => Array.isArray( d ) ?
            d.filter(
                i => Array.isArray( i ) && i.length === 2
            ).length === d.length :
            false,
        '*': d => d === d
    },
    struct = superstruct( {
        types
    } );

/**
 * structs
 * @description
 * list of json structures used throughout the api
 * @mixin structs
 */
module.exports = {
    map: 'map',
    array: 'array',
    arrayOfObjects: [ 'object' ],
    object: 'object',
    objectId: 'objectId',
    pioneerTask: struct(
        {
            url: 'hostname',
            browserOpts: 'object?',
            pageOpts: 'object?',
            scan: 'boolean?',
            plugins: 'array'
        },
        {
            browserOpts: {
                headless: true,
                slowMo: 250,
                devtools: true
            },
            pageOpts: {
                waitUntil: 'networkidle2'
            },
            scan: false,
            plugins: []
        }
    ),
    types,
    struct,
    validate: ( expected, data ) => new Promise(
        ( res, rej ) => {
            const validation = struct( expected ).validate( data );
            if ( validation[ 0 ] ) {
                rej( new Response( 417, { error: validation[ 0 ].message, expected } ) );
            }
            else {
                res( validation[ 1 ] );
            }
        }
    )
};
