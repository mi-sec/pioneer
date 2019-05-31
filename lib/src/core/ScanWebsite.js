/** ****************************************************************************************************
 * File: ScanWebsite.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-May-2019
 *******************************************************************************************************/
'use strict';

const
	LightMap       = require( '@mi-sec/lightmap' ),
	ScanPage       = require( './ScanPage' ),
	ScanResource   = require( './ScanResource' ),
	{ isValidURL } = require( '../utils/general' );

class ScanWebsite
{
	constructor( { browser, baseUrl, ...opts } )
	{
		if ( !browser || !baseUrl ) {
			throw new Error( 'browser and baseUrl are required' );
		}

		this.browser = browser;
		this.baseUrl = new URL( baseUrl );

		this.opts         = opts;
		this.pageOpts     = opts.pageOpts;
		this.resourceOpts = opts.resourceOpts;

		this.cache = new LightMap();
		this.cache.set( 'baseUrl', baseUrl );
		this.cache.set( 'nodes', new LightMap() );
	}

	async init()
	{
		// create entry page scan
	}

	formatURL( url )
	{
		if ( typeof url === 'object' ) {
			if ( url.hasOwnProperty( 'url' ) ) {
				url = url.url;
			}
		}

		if ( !url ) {
			url = this.baseUrl;
		}

		url      = new URL( url );
		url.hash = '';
		url      = url.href;

		return url;
	}

	shouldScanURL( url )
	{
		const nodes = this.cache.get( 'nodes' );

		if ( /void\( ?0? ?\)/.test( url ) ) {
			nodes.set( url, new LightMap( [
				[ 'id', this.incrementId++ ],
				[ 'url', url ],
				[ 'type', 'error' ],
				[ 'error', 'requires javascript click' ],
				[ 'external', false ]
			] ) );
			return false;
		}
		else if ( !isValidURL( url ) ) {
			nodes.set( url, new LightMap( [
				[ 'id', this.incrementId++ ],
				[ 'url', url ],
				[ 'type', 'error' ],
				[ 'error', 'invalid url' ],
				[ 'external', false ]
			] ) );
			return false;
		}
		else if ( nodes.has( url ) ) {
			return false;
		}

		return true;
	}

	async checkResource( url )
	{
		const obj = { ...url };
		url       = this.formatURL( url );

		if ( !this.shouldScanURL( url ) ) {
			return;
		}

		const nodes = this.cache.get( 'nodes' );

		const page = new ScanResource( {
			url,
			...this.resourceOpts
		} );

		page.init();

		page.cache.set( 'type', obj.type );
		page.cache.get( 'info' ).resourceType = obj.type;

		try {
			await page.goto();
		} catch ( e ) {
			nodes.set( page.href, page.cache );
			return;
		}

		nodes.set( page.href, page.cache );

		return url;
	}

	async scan( url )
	{
		url = this.formatURL( url );

		if ( !this.shouldScanURL( url ) ) {
			return;
		}

		const nodes = this.cache.get( 'nodes' );

		console.log( `scanning: ${ url }` );

		const page = new ScanPage( {
			browser: this.browser,
			url,
			...this.pageOpts
		} );

		await page.init();

		try {
			await page.goto();
		} catch ( e ) {
			nodes.set( page.href, page.cache );
			return;
		} finally {
			page.cache.set( 'type', page.cache.get( 'info' ).type );
		}

		nodes.set( page.href, page.cache );

		if ( !page.cache.get( 'url' ).startsWith( this.baseUrl.href ) ) {
			page.cache.set( 'external', true );
			return;
		}

		await page.getPageDimensions();
		await page.scanForNavigationLinks();

		const links = page.cache.get( 'links' );

		for ( let i = 0; i < links.length; i++ ) {
			const resource = links[ i ];

			if ( resource.type === 'navigation' ) {
				await this.scan( resource );
			}
			else {
				await this.checkResource( resource );
			}
		}
	}
}

module.exports = ScanWebsite;
