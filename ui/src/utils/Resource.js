/** ****************************************************************************************************
 * File: Resource.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2019
 *******************************************************************************************************/
'use strict';

import LightMap from '@mi-sec/lightmap';

let i = 0;

export default class Resource
{
	constructor( opts )
	{
		if ( !( opts instanceof LightMap ) ) {
			throw new TypeError( 'opts must be instanceof LightMap' );
		}

		this.id         = i++;
		this.url        = opts.get( 'url' ) || '';
		this.type       = opts.get( 'type' ) || '';
		this.info       = opts.get( 'info' ) || {};
		this.links      = opts.get( 'links' ) || [];
		this.timing     = opts.get( 'timing' ) || {};
		this.external   = opts.get( 'external' ) || false;
		this.dimensions = opts.get( 'dimensions' ) || {};
		this.consoleMsg = opts.get( 'consoleMsg' ) || [];
	}

	get children()
	{
		return this.links;
	}
}
