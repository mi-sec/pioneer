/** ****************************************************************************************************
 * File: ScanPage.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-May-2019
 *******************************************************************************************************/
'use strict';

const
	LightMap = require( '@parellin/lightmap' );

class ScanPage
{
	constructor( { browser, url, ...opts } )
	{
		if( !browser || !url ) {
			throw new Error( 'browser and url are required' );
		}

		this.browser = browser;
		this.url     = url;

		this.opts  = opts;
		this.cache = new LightMap();
		this.cache.set( 'info', {} );
		this.cache.set( 'timing', {} );
	}

	async init()
	{
		this.page = await this.browser.newPage();
		await this.page.setRequestInterception( true );

		this.page.on( 'request', this.request.bind( this ) );
		this.page.on( 'requestfailed', this.requestfailed.bind( this ) );
		this.page.on( 'requestfinished', this.requestfinished.bind( this ) );
		this.page.on( 'domcontentloaded', this.domcontentloaded.bind( this ) );
		this.page.on( 'metrics', function() {
			console.log( '\n\n' );
			console.log( arguments );
			console.log( '\n\n' );
		} );

		this.page.on( 'response', this.response.bind( this ) );
	}

	async goto( opts = { waitUntil: 'networkidle2' } )
	{
		this.data = await this.page.goto( this.url, opts );
	}

	request( request )
	{
		const
			info   = this.cache.get( 'info' ),
			timing = this.cache.get( 'timing' );

		info.url          = request.url();
		info.headers      = request.headers();
		info.method       = request.method();
		info.resourceType = request.resourceType();
		timing.initial    = process.hrtime();

		// Set it up in case it doesn't respond
		// if( cache.get( 'nodes' ).has( url.href ) ) {
		// 	return request.abort( 'aborted' );
		// }
		// cache.get( 'nodes' ).set(
		// 	url.href,
		// 	{
		// 		url: url.href,
		// 		status: 0,
		// 		ok: 'unknown',
		// 		external: url.hostname !== parent.hostname,
		// 		parent: parent.href
		// 	}
		// );

		request.continue();
	}

	requestfailed( request )
	{
		console.log( 'on:requestfailed' );
		const url    = new URL( request.url() );
		const reason = request.failure();

		if( reason.errorText === 'net::ERR_ABORTED' ) {
			// Do nothing because we aborted it
			return;
		}

		const timing      = this.cache.get( 'timing' );
		timing.requestEnd = process.hrtime( timing.requestStart );

		// TODO:: check request response codes and cache
		cache.get( 'nodes' ).set(
			url.href,
			{
				url: url.href,
				status: 0,
				ok: reason.errorText,
				external: url.hostname !== parent.hostname,
				parent: parent.href
			}
		);

		console.log( 'request failed url:', url.href );
	}

	requestfinished()
	{
		console.log( '\n\n' );
		console.log( arguments );
		const timing      = this.cache.get( 'timing' );
		timing.requestEnd = process.hrtime( timing.initial );
	}

	response( response )
	{
		console.log( 'on:response' );
		// const request = response.request();
		const status = response.status();
		// const url     = request.url();

		const info = this.cache.get( 'info' );

		info.status        = status;
		info.ok            = response.ok();
		info.remoteAddress = response.remoteAddress();

		const secDetails = response.securityDetails();

		if( secDetails ) {
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
}

module.exports = ScanPage;
