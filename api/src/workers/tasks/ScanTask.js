/** ****************************************************************************************************
 * File: ScanTask.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	{
		parentPort,
		workerData
	}         = require( 'worker_threads' ),
	puppeteer = require( 'puppeteer' );

const PioneerPage = require( './PioneerPage' );

( async () => {
	try {
		parentPort.postMessage( { state: 'IN_PROGRESS' } );

		const data = {
			url: workerData.url,
			config: workerData,
			cache: new Set()
		};

		const root = {
			id: 0,
			children: []
		};

		const browser = await puppeteer.launch( {
			args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
			...data.config.browserOpts
		} );

		const page = new PioneerPage( data.url, data.config );

		await page.init( browser );

		const cdpSession = await page._page().target().createCDPSession();
		console.log( cdpSession );
		await cdpSession.send( 'Network.enable' );

		await cdpSession.send( 'Network.setRequestInterception', {
			patterns: [ { urlPattern: '*' } ]
		} );

		await cdpSession.on( 'Network.requestIntercepted', async e => {
			console.log( 'EVENT INFO: ' );
			console.log( e );
			console.log( e.interceptionId );
			console.log( e.resourceType );
			console.log( e.isNavigationRequest );

			// pass all network requests (not part of a question)
			await cdpSession.send( 'Network.continueInterceptedRequest', {
				interceptionId: e.interceptionId
			} );
		} );

		await page.goto();

		// console.log( page );

		// if ( !data.config.scan ) {
		// const page = await browser.newPage();
		// await page.goto( 'https://example.com' );
		// await page.screenshot( { path: 'screenshot.png' } );
		// await page.screenshot( { path: resolve( path, 'screenshot.png' ) } );

		const targets = await browser.targets();
		console.log( targets );
		// console.log( 'HERE' );

		// find Devtools target URL
		const devtoolsUrl = targets
			.map( ( { _targetInfo } ) => {
				console.log( _targetInfo.url );
				return _targetInfo.url;
			} )
			.find( ( url ) => url.indexOf( 'chrome-devtools://' ) !== -1 );

		console.log( devtoolsUrl );

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

		await browser.close();

		root.children.push( page );

		parentPort.postMessage( { state: 'COMPLETE', data: root } );
	} catch ( e ) {
		console.error( '\n' );
		console.error( e );
		console.error( '\n' );
		parentPort.postMessage( {
			state: 'FAILED',
			error: e
		} );
	}
} )();
