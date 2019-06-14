/** ****************************************************************************************************
 * File: PioneerPage.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	config      = require( 'config' ),
	UUIDv4      = require( 'uuid/v4' ),
	LightMap    = require( '@mi-sec/lightmap' ),
	{ resolve } = require( 'path' ),
	{ getId }   = require( './utils' );

class PioneerPage
{
	#config     = null;
	#page       = null;
	#cdpSession = null;
	#data       = null;
	#requestId  = null;

	constructor( url, config )
	{
		this.#config = config;

		this.id   = getId();
		this.url  = url;
		this.type = '';

		this.request  = null;
		this.response = null;

		this.external = false;

		this.consoleMsg      = [];
		this.children        = [];
		this.navigationLinks = [];
		this.plugins         = [];
		this.resources       = new LightMap();
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
		this.#page.on( 'request', this._request.bind( this ) );
		this.#page.on( 'requestfailed', this._requestfailed.bind( this ) );
		this.#page.on( 'response', this._response.bind( this ) );
		this.#page.on( 'domcontentloaded', this._domcontentloaded.bind( this ) );
		this.#page.on( 'requestfinished', this._requestfinished.bind( this ) );
		this.#page.on( 'console', this._console.bind( this ) );

		this.#cdpSession = await this.#page.target().createCDPSession();

		await this.#cdpSession.send( 'Network.enable' );
		await this.#cdpSession.send( 'Network.setRequestInterception', {
			patterns: [ { urlPattern: '*' } ]
		} );

		await this.#cdpSession.on( 'Network.requestIntercepted', async e => {
			if ( e.request.url === this.url ) {
				this.#requestId = e.requestId;
				this.request    = e.request;
			}
			else {
				this.resources.set( '' + e.requestId, {
					request: e,
					response: null
				} );
			}

			await this.#cdpSession.send( 'Network.continueInterceptedRequest', {
				interceptionId: e.interceptionId
			} );
		} );

		await this.#cdpSession.on( 'Network.responseReceived', async e => {
			if ( e.requestId === this.#requestId ) {
				this.type     = e.type;
				this.response = e.response;
			}
			else {
				this.resources.get( '' + e.requestId ).response = e;
			}
		} );
	}

	async goto()
	{
		this.#data = await this.#page.goto( this.url, {
			timeout: this.#config.pageOpts.timeout,
			waitUntil: this.#config.pageOpts.waitUntil,
			referer: this.#config.pageOpts.referer
		} );
	}

	async execPlugins()
	{
		for ( let i = 0; i < this.#config.plugins.length; i++ ) {
			const plugin = this.#config.plugins[ i ];

			if ( plugin.module === 'screenshot' ) {
				await this.takeScreenshot( plugin.opts );
			}
			else if ( plugin.module === 'pdf' ) {
				await this.printToPDF( plugin.opts );
			}
		}
	}

	_page()
	{
		return this.#page;
	}

	_request( request )
	{
		console.log( 'on:request' );
		request.continue();
	}

	_requestfailed( request )
	{
		console.log( 'on:requestfailed' );
	}

	_response( response )
	{
		console.log( 'on:response' );
	}

	_domcontentloaded()
	{
		console.log( 'on:domcontentloaded' );
	}

	_requestfinished()
	{
		console.log( 'on:requestfinished' );
	}

	async _console( msg )
	{
		const payload = [];

		for ( const arg of msg.args() ) {
			const val = await arg.jsonValue();
			payload.push( val );
		}

		this.consoleMsg.push( payload );
	}

	generateStoragePath( ext = '' )
	{
		const id = UUIDv4();

		return {
			filePath: resolve( config.get( 'storage.path' ), `${ id }${ ext }` ),
			apiPath: `${ config.get( 'storage.apiRoute' ) }${ id }${ ext }`
		};
	}

	// See https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions
	async takeScreenshot( opts = {} )
	{
		const
			pathInfo = this.generateStoragePath( '.png' );

		await this.#page.screenshot( {
			...opts,
			path: pathInfo.filePath
		} );

		this.plugins.push( {
			module: 'screenshot',
			...pathInfo
		} );
	}

	// See https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
	async printToPDF( opts = {} )
	{
		const
			pathInfo = this.generateStoragePath( '.pdf' );

		await this.#page.pdf( {
			...opts,
			path: pathInfo.filePath
		} );

		this.plugins.push( {
			module: 'pdf',
			...pathInfo
		} );
	}

	async scanForNavigationLinks()
	{
		this.navigationLinks = await this.#page.evaluate(
			() => Array.from(
				Object.keys( document.links )
					.map( k => ( {
						type: 'navigation',
						url: document.links[ k ].href
					} ) )
			)
		);
	}
}

module.exports = PioneerPage;
