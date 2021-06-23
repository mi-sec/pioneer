/** ****************************************************************************************************
 * File: ecosystem.config.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Jun-2019
 *******************************************************************************************************/
'use strict';

const
    { resolve }  = require( 'path' ),
    isProduction = process.argv.includes( 'production' );

module.exports = [
    {
        name: 'pioneer-api',
        script: resolve( __dirname, './api.entrypoint.js' ),
        exec_mode: 'cluster',
        instances: isProduction ? 0 : 1,
        instance_var: 'INSTANCE_ID',
        watch: !isProduction,
        ignore_watch: [ 'storage' ],
        wait_ready: true,
        autorestart: isProduction,
        restartDelay: 5000,
        max_memory_restart: '1G',
        node_args: [
            '--no-warnings',
            '--max_old_space_size=4096'
        ],
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    },
    {
        name: 'pioneer-workers',
        script: resolve( __dirname, './workers.entrypoint.js' ),
        exec_mode: 'cluster',
        instances: isProduction ? 0 : 1,
        instance_var: 'INSTANCE_ID',
        watch: !isProduction,
        ignore_watch: [ 'storage' ],
        wait_ready: true,
        autorestart: isProduction,
        restartDelay: 5000,
        max_memory_restart: '1G',
        node_args: [
            '--no-warnings',
            '--max_old_space_size=4096',
            '--experimental-worker'
        ],
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }
];
