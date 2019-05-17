/** ****************************************************************************************************
 * File: ScanResource.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-May-2019
 *******************************************************************************************************/
'use strict';

const
	axios    = require( 'axios' ),
	LightMap = require( '@parellin/lightmap' );

class ScanResource
{
	constructor( { url, ...opts } )
	{
		this.url  = new URL( url );
		this.href = this.url.href;

		this.opts  = opts;
		this.cache = new LightMap();
		this.cache.set( 'url', url );
		this.cache.set( 'info', {} );
		this.cache.set( 'timing', {} );
		this.cache.set( 'external', false );
		this.cache.set( 'consoleMsg', [] );
	}

	init()
	{
		const timing   = this.cache.get( 'timing' );
		timing.initial = process.hrtime();
	}

	async goto()
	{
		const request = await axios( {
			url: this.href,
			method: 'head'
		} );

		const
			info   = this.cache.get( 'info' ),
			timing = this.cache.get( 'timing' );

		info.url     = request.config.url;
		info.headers = request.headers;
		info.method  = request.request.method;

		timing.responseEnd = process.hrtime( timing.initial );

		info.ok         = request.status < 300;
		info.status     = request.statusText;
		info.statusCode = request.status;
	}
}

module.exports = ScanResource;
