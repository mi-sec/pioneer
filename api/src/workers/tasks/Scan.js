/** ****************************************************************************************************
 * File: ScanPage.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	{
		isMainThread,
		parentPort,
		workerData: config
	}         = require( 'worker_threads' ),
	puppeteer = require( 'puppeteer' );

console.log( 'isMainThread', isMainThread );

( async () => {
	try {
		parentPort.postMessage( { state: 'IN_PROGRESS' } );

		console.log( 'workerData', config );

		config.browserOpts = config.browserOpts || {};

		console.log( config );
		console.log( puppeteer );

		const browser = await puppeteer.launch( {
			// headless: config.browserOpts.headless || false,
			// slowMo: config.browserOpts.slowMo || 250,
			devtools: config.browserOpts.devtools || true
		} );

		console.log( browser );

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


		parentPort.postMessage( { state: 'COMPLETE' } );
	} catch ( e ) {
		parentPort.postMessage( {
			state: 'FAILED',
			error: e
		} );
	}
} )();
