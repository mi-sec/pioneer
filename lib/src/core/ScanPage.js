/** ****************************************************************************************************
 * File: ScanPage.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-May-2019
 *******************************************************************************************************/
'use strict';

const
	LightMap               = require( '@parellin/lightmap' ),
	scanForNavigationLinks = require( '../plugins/scanForNavigationLinks' );

class ScanPage
{
	constructor( { browser, url, ...opts } )
	{
		if ( !browser || !url ) {
			throw new Error( 'browser and url are required' );
		}

		this.browser = browser;
		this.url     = new URL( url );
		this.href    = this.url.href;

		this.opts  = opts;
		this.cache = new LightMap();
		this.cache.set( 'url', url );
		this.cache.set( 'info', {} );
		this.cache.set( 'links', [] );
		this.cache.set( 'timing', {} );
		this.cache.set( 'external', false );
		this.cache.set( 'consoleMsg', [] );
	}

	async init()
	{
		this.page = await this.browser.newPage();
		await this.page.setRequestInterception( true );

		this.page.on( 'request', this.request.bind( this ) );
		this.page.on( 'requestfailed', this.requestfailed.bind( this ) );
		this.page.on( 'requestfinished', this.requestfinished.bind( this ) );
		this.page.on( 'domcontentloaded', this.domcontentloaded.bind( this ) );
		this.page.on( 'response', this.response.bind( this ) );
		this.page.on( 'console', this.console.bind( this ) );
	}

	async goto( opts = { waitUntil: 'networkidle2' } )
	{
		this.data = await this.page.goto( this.url, opts );
	}

	request( request )
	{
		console.log( 'on:request' );
		if ( this.opts.disableExternalLoading ) {
			const type = request.resourceType();

			if ( [ 'image', 'stylesheet', 'font', 'script' ].indexOf( type ) !== -1 ) {
				this.cache.get( 'links' ).push( { type, url: request.url() } );
				return request.abort( 'aborted' );
			}
		}

		const
			info   = this.cache.get( 'info' ),
			timing = this.cache.get( 'timing' );

		info.url       = request.url();
		info.type      = request.resourceType();
		info.headers   = request.headers();
		info.method    = request.method();
		timing.initial = process.hrtime();

		request.continue();
	}

	requestfailed( request )
	{
		console.log( 'on:requestfailed' );
		const url    = new URL( request.url() );
		const reason = request.failure();

		console.log( reason );

		if ( reason.errorText === 'net::ERR_ABORTED' ) {
			// Do nothing because we aborted it
			return;
		}

		const
			info   = this.cache.get( 'info' ),
			timing = this.cache.get( 'timing' );

		timing.requestEnd = process.hrtime( timing.initial );

		if ( reason.errorText === 'net::ERR_CONNECTION_REFUSED' ) {
			info.status     = 'ERR_CONNECTION_REFUSED';
			info.statusCode = 0;
		}

		console.log( 'request failed url:', url.href );
	}

	requestfinished()
	{
		console.log( 'on:requestfinished' );
		const timing      = this.cache.get( 'timing' );
		timing.requestEnd = process.hrtime( timing.initial );
	}

	response( response )
	{
		console.log( 'on:response' );

		const timing       = this.cache.get( 'timing' );
		timing.responseEnd = process.hrtime( timing.initial );

		const info = this.cache.get( 'info' );

		info.ok            = response.ok();
		info.status        = response.statusText();
		info.statusCode    = response.status();
		info.remoteAddress = response.remoteAddress();

		const secDetails = response.securityDetails();

		if ( secDetails ) {
			info.securityDetails = {
				subjectName: secDetails.subjectName(),
				issuer: secDetails.issuer(),
				validFrom: secDetails.validFrom(),
				validTo: secDetails.validTo(),
				protocol: secDetails.protocol()
			};
		}
	}

	domcontentloaded()
	{
		const timing            = this.cache.get( 'timing' );
		timing.domcontentloaded = process.hrtime( timing.initial );
	}

	async console( msg )
	{
		const payload = [];

		for ( const arg of msg.args() ) {
			const val = await arg.jsonValue();
			payload.push( val );
		}

		this.cache.get( 'consoleMsg' ).push( payload );
	}

	async getPageDimensions()
	{
		const dimensions = await this.page.evaluate( () => {
			return {
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight,
				deviceScaleFactor: window.devicePixelRatio
			};
		} );

		this.cache.set( 'dimensions', dimensions );
	}

	async scanForNavigationLinks()
	{
		this.cache.get( 'links' ).push(
			...( await scanForNavigationLinks( this.page ) )
		);
	}
}

module.exports = ScanPage;
