/** ****************************************************************************************************
 * File: Pioneer.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 19-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	{
		promises: { writeFile }
	}         = require( 'fs' ),
	puppeteer = require( 'puppeteer' ),
	LightMap  = require( '@parellin/lightmap' );

const ScanWebsite            = require( './ScanWebsite' );
const ScanPage               = require( './ScanPage' );
const spellCheck             = require( '../plugins/spellcheck' );
const scanForNavigationLinks = require( '../plugins/scanForNavigationLinks' );

( async () => {
	const browser = await puppeteer.launch( {
		// headless: false,
		// slowMo: 250
	} );

	// TODO: add directives for spell check, 404, evaluate for size, screenshot, website indexing etc.
	// TODO: check for favicon
	// TODO: (warning) check for "alt" required in img refs
	// https://parellin-technologies-llc.github.io/lightmap/

	const scan = new ScanWebsite( {
		browser,
		baseUrl: 'http://localhost:8080/',
		pageOpts: {
			disableExternalLoading: true
		}
	} );

	await scan.init();
	await scan.scan();

	await writeFile( './scantree.json', JSON.stringify( scan.cache, null, 4 ) );

	await browser.close();
} )();
