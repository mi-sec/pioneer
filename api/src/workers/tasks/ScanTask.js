/** ****************************************************************************************************
 * File: ScanTask.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	puppeteer = require( 'puppeteer' ),
	{
		parentPort,
		workerData
	}         = require( 'worker_threads' );

const
	PioneerPage = require( './PioneerPage' );

( async () => {
	try {
		parentPort.postMessage( { state: 'IN_PROGRESS' } );

		const data = {
			url: workerData.url,
			config: workerData
		};

		const browser = await puppeteer.launch( {
			args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
			...data.config.browserOpts
		} );

		// TODO: start a timer to set STALLED timeout

		const page = new PioneerPage( data.url, data.config );
		await page.init( browser );
		await page.goto();
		await page.execPlugins();
		await browser.close();

		parentPort.postMessage( { state: 'COMPLETE', data: page } );
	} catch ( e ) {
		parentPort.postMessage( {
			state: 'FAILED',
			error: e
		} );
	}
} )();