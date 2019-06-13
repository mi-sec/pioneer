/** ****************************************************************************************************
 * File: PioneerPage.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	{ getId } = require( './utils' );

class PioneerPage
{
	#page = null;
	#data = null;

	constructor( url, config )
	{
		this.id         = getId();
		this.url        = url;
		this.config     = config;
		this.type       = '';
		this.info       = {};
		this.timing     = {};
		this.external   = false;
		this.consoleMsg = [];
		this.links      = [];
		this.children   = [];
	}

	formatURL()
	{
		if ( typeof this.url === 'object' ) {
			if ( this.url.hasOwnProperty( 'url' ) ) {
				this.url = this.url.url;
			}
		}

		this.url      = new URL( this.url );
		this.url.hash = '';
		this.url      = this.url.href;
	}

	async init( browser )
	{
		this.formatURL();

		this.#page = await browser.newPage();
		await this.#page.setRequestInterception( true );

		this.#page.on( 'request', this.request.bind( this ) );
		this.#page.on( 'requestfailed', this.requestfailed.bind( this ) );
		this.#page.on( 'response', this.response.bind( this ) );
		this.#page.on( 'domcontentloaded', this.domcontentloaded.bind( this ) );
		this.#page.on( 'requestfinished', this.requestfinished.bind( this ) );
		this.#page.on( 'console', this.console.bind( this ) );
	}

	async goto()
	{
		this.#data = await this.#page.goto( this.url, {
			timeout: this.config.pageOpts.timeout,
			waitUntil: this.config.pageOpts.waitUntil,
			referer: this.config.pageOpts.referer
		} );

		this.info.metrics = await this.#page.metrics();
	}

	_page()
	{
		return this.#page;
	}

	request( request )
	{
		console.log( 'on:request' );
		if ( this.config.pageOpts.disableExternalLoading ) {
			const type = request.resourceType();

			if ( [ 'image', 'stylesheet', 'font', 'script' ].indexOf( type ) !== -1 ) {
				this.links.push( { type, url: request.url() } );
				return request.abort( 'aborted' );
			}
		}

		this.info.url       = request.url();
		this.info.type      = request.resourceType();
		this.info.headers   = request.headers();
		this.info.method    = request.method();
		this.timing.initial = process.hrtime();

		request.continue();
	}

	requestfailed( request )
	{
		console.log( 'on:requestfailed' );
		const
			url    = new URL( request.url() ),
			reason = request.failure();

		console.log( reason );

		if ( reason.errorText === 'net::ERR_ABORTED' ) {
			// Do nothing because we aborted it
			return;
		}

		this.timing.requestEnd = process.hrtime( this.timing.initial );

		if ( reason.errorText === 'net::ERR_CONNECTION_REFUSED' ) {
			this.info.status     = 'ERR_CONNECTION_REFUSED';
			this.info.statusCode = 0;
		}

		console.log( 'request failed url:', url.href );
	}

	response( response )
	{
		console.log( 'on:response' );

		this.timing.responseEnd = process.hrtime( this.timing.initial );
		this.info.ok            = response.ok();
		this.info.status        = response.statusText();
		this.info.statusCode    = response.status();
		this.info.remoteAddress = response.remoteAddress();

		const secDetails = response.securityDetails();

		if ( secDetails ) {
			this.info.securityDetails = {
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
		this.timing.domcontentloaded = process.hrtime( this.timing.initial );
	}

	requestfinished()
	{
		console.log( 'on:requestfinished' );
		this.timing.requestEnd = process.hrtime( this.timing.initial );
	}

	async console( msg )
	{
		const payload = [];

		for ( const arg of msg.args() ) {
			const val = await arg.jsonValue();
			payload.push( val );
		}

		this.consoleMsg.push( payload );
	}

	async getPageDimensions()
	{
		this.info.dimensions = await this.#page.evaluate( () => {
			return {
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight,
				deviceScaleFactor: window.devicePixelRatio
			};
		} );
	}

	async scanForNavigationLinks()
	{
		this.cache.get( 'links' ).push(
			...( await scanForNavigationLinks( this.page ) )
		);
	}
}

module.exports = PioneerPage;
