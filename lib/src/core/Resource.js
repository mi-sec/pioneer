/** ****************************************************************************************************
 * File: Resource.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2019
 *******************************************************************************************************/
'use strict';

const LightMap = require( '@mi-sec/lightmap' );

class Resource
{
	constructor( opts )
	{
		if ( !( opts instanceof LightMap ) ) {
			throw new TypeError( 'opts must be instanceof LightMap' );
		}

		this.url        = opts.get( 'url' ) || '';
		this.name       = this.url;
		this.children   = opts.get( 'links' ) || [];
		this.type       = opts.get( 'type' ) || '';
		this.info       = opts.get( 'info' ) || {};
		this.timing     = opts.get( 'timing' ) || {};
		this.external   = opts.get( 'external' ) || false;
		this.dimensions = opts.get( 'dimensions' ) || {};
		this.consoleMsg = opts.get( 'consoleMsg' ) || [];
	}
}

module.exports = Resource;
