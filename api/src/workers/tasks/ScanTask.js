/** ****************************************************************************************************
 * File: ScanTask.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	EventEmitter = require( 'events' ),
	puppeteer    = require( 'puppeteer' );

const PioneerPage = require( './PioneerPage' );

class ScanTask extends EventEmitter
{
	constructor( config )
	{
		super();

		this.config = config;
		this.url    = this.config.url;
		this.cache  = new Set();
		this.root   = {
			id: 0,
			children: []
		};

		this.emit( 'ready' );
	}

	async run()
	{
		this.emit( 'message', { state: 'IN_PROGRESS' } );

		console.debug( '[[creating browser]]' );
		const browser = await puppeteer.launch( {
			args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
			...data.config.browserOpts
		} );
		console.debug( '[[browser created]]' );

		console.debug( '[[creating page]]' );
		const page = new PioneerPage( data.url, data.config );
		console.debug( '[[page created]]' );
		await page.init( browser );
		console.debug( '[[page init]]' );

		console.debug( '[[going to page]]' );
		await page.goto();
		console.debug( '[[page fetched]]' );

		console.log( page );

		await browser.close();

		console.log( 'here' );
		console.log( data );

		this.emit( 'message', { state: 'COMPLETE', data } );
	}
}

module.exports = ScanTask;

// ( async () => {
// 	try {
// 		parentPort.postMessage( { state: 'IN_PROGRESS' } );
//
// 		console.log( 'workerData', workerData );

// const data = {
// 	url: workerData.url,
// 	config: workerData,
// 	cache: new Set(),
// 	root: {
// 		id: 0,
// 		children: []
// 	}
// };
//
// console.debug( '[[creating browser]]' );
// const browser = await puppeteer.launch( {
// 	args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
// 	...data.config.browserOpts
// } );
// console.debug( '[[browser created]]' );
//
// console.debug( '[[creating page]]' );
// const page = new PioneerPage( data.url, data.config );
// console.debug( '[[page created]]' );
// await page.init( browser );
// console.debug( '[[page init]]' );
//
// console.debug( '[[going to page]]' );
// await page.goto();
// console.debug( '[[page fetched]]' );
//
// console.log( page );
//
// await browser.close();
//
// console.log( 'here' );
// console.log( data );

// if ( !data.config.scan ) {
// const page = await browser.newPage();
// await page.goto( 'https://example.com' );
// await page.screenshot( { path: 'screenshot.png' } );
// await page.screenshot( { path: resolve( path, 'screenshot.png' ) } );

// const targets = await browser.targets();
// console.log( targets );
// console.log( 'HERE' );

// find Devtools target URL
// const devtoolsUrl = targets
// 	.map( ( { _targetInfo } ) => {
// 		console.log( _targetInfo );
// 		return _targetInfo.url;
// 	} )
// 	.find( ( url ) => url.indexOf( 'chrome-devtools://' ) !== -1 );
//
// console.log( devtoolsUrl );
// }

// load the Devtools page in a new tab
// const page = await browser.newPage();
// await page.goto( devtoolsUrl );

// config.get( 'storage.path' );

// const targets = await browser.targets();
//
// console.log( targets );
//
// // find Devtools target URL
// const devtoolsUrl = targets
// 	.map( ( { _targetInfo } ) => _targetInfo.url )
// 	.find( ( url ) => url.indexOf( 'chrome-devtools://' ) !== -1 );
//
// // load the Devtools page in a new tab
// const page = await browser.newPage();
// await page.goto( devtoolsUrl );
//
// // click on Network tab
// const networkTab = await page.evaluateHandle( `document.querySelector('#-blink-dev-tools > div.widget.vbox.root-view > div > div.widget.vbox.insertion-point-sidebar > div > div').shadowRoot.querySelector('#tab-network');` );
// await networkTab.click();

// 		parentPort.postMessage( { state: 'COMPLETE', data: page } );
// 	} catch ( e ) {
// 		console.error( '\n' );
// 		console.error( e );
// 		console.error( '\n' );
// 		parentPort.postMessage( {
// 			state: 'FAILED',
// 			error: e
// 		} );
// 	}
// } )();
