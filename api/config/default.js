/** ****************************************************************************************************
 * File: default.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 26-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	{ join }          = require( 'path' ),
	{ name, version } = require( '../package' );

process.title = process.env.API_PID_TITLE || `${ name }-v${ version }`;

const config = {
	name,
	version: `v${ version }`,
	title: process.env.API_PID_TITLE || `${ name }-v${ version }`,
	NODE_ENV: process.env.NODE_ENV,
	runtime: process.versions,

	server: {
		host: '0.0.0.0',
		port: 3000,
		routes: process.env.API_ROUTE_PATH || join( process.cwd(), 'src', 'routes' ),
		packet: {
			timeout: +process.env.SERVER_PACKET_TIMEOUT || 20000,
			dotfiles: 'allow'
		}
	},

	mongodb: {
		uri: `mongodb://${ process.env.MONGO_HOST || 'pioneer_mongo' }:${ process.env.MONGO_PORT || 27017 }/pioneer`,
		ipFamily: 4,
		useNewUrlParser: true
	},

	storage: {
		path: join( process.cwd(), 'storage' ),
		apiRoute: '/api/storage/',
		assets: join( process.cwd(), 'assets' )
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
