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

async function getHrefs( page ) {
	return await page.evaluate( () => {
		const anchors = document.querySelectorAll( 'a' );
		return [].map.call( anchors, a => a.href );
	} );
}

async function searchForLinks( browser, parent, cache ) {
	console.log( 'searchForLinks' );

	const page = await browser.newPage();
	await page.setRequestInterception( true );

	page
		.on( 'request', request => {
			console.log( 'on:request' );
			const url = new URL( request.url() );

			// Set it up in case it doesn't respond

			if( cache.get( 'nodes' ).has( url.href ) ) {
				return request.abort( 'aborted' );
			}

			cache.get( 'nodes' ).set(
				url.href,
				{
					url: url.href,
					status: 0,
					ok: 'unknown',
					external: url.hostname !== parent.hostname,
					parent: parent.href
				}
			);

			console.log( 'request  url:', url.href );
			request.continue();
		} )
		.on( 'requestfailed', request => {
			console.log( 'on:requestfailed' );
			const url    = new URL( request.url() );
			const reason = request.failure();

			if( reason.errorText === 'net::ERR_ABORTED' ) {
				// Do nothing because we aborted it
				return;
			}

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
		} )
		.on( 'response', response => {
			console.log( 'on:response' );
			const request = response.request();
			const status  = response.status();
			const url     = new URL( request.url() );
			const ref     = cache.get( 'nodes' ).get( url.href );

			ref.url           = url.href;
			ref.status        = status;
			ref.ok            = response.ok();
			ref.external      = url.hostname !== parent.hostname;
			ref.parent        = parent.href;
			ref.remoteAddress = response.remoteAddress();

			const secDetails = response.securityDetails();

			if( secDetails ) {
				ref.securityDetails = {
					subjectName: secDetails.subjectName(),
					issuer: secDetails.issuer(),
					validFrom: secDetails.validFrom(),
					validTo: secDetails.validTo(),
					protocol: secDetails.protocol()
				};
			}

			console.log( 'response url:', url.href, 'status:', status );
		} );

	await page.goto( parent, { waitUntil: 'networkidle2' } );
	await page.waitFor( 500 );

	let hrefs = await getHrefs( page );

	console.log( hrefs );

	for( let url of hrefs ) {
		url = new URL( url );

		const href = url.href.replace( url.hash, '' );

		console.log( `eval href    : ${ href }` );
		console.log( `cached       : ${ cache.get( 'nodes' ).has( href ) }` );

		if( cache.get( 'nodes' ).has( href ) ) {
			const ref = cache.get( 'nodes' ).get( href );

			console.log( `found circular: ${ href }` );
			// todo: link this up with some more info
			ref.circular = ref.circular || [];
			ref.circular.push( url.href );
		}
		else if( url.hostname !== parent.hostname ) {
			console.log( `eval ext href: ${ href }` );

			const extPage = await browser.newPage();
			await extPage.setRequestInterception( false );
			const extResponse = await extPage.goto( href );

			console.log( `ext href res : ${ extResponse.status() }` );
			cache.get( 'nodes' ).set(
				url.href,
				{
					url: url.href,
					status: extResponse.status(),
					ok: extResponse.ok(),
					external: url.hostname !== parent.hostname,
					parent: parent.href,
					remoteAddress: extResponse.remoteAddress(),
					securityDetails: {
						subjectName: extResponse.securityDetails().subjectName(),
						issuer: extResponse.securityDetails().issuer(),
						validFrom: extResponse.securityDetails().validFrom(),
						validTo: extResponse.securityDetails().validTo(),
						protocol: extResponse.securityDetails().protocol()
					}
				}
			);
		}
		else {
			console.log( `search url: ${ url.href }` );
			await searchForLinks( browser, url, cache );
		}
	}

	// hrefs.forEach(
	// 	resp => {
	// 		console.log( resp );
	//
	// 		const refHost = new URL( resp._request._url );
	//
	// 		console.log( refHost );
	//
	// 		if( cache.has( refHost.href ) ) {
	// 			return cache.get( 'nodes' ).get( refHost.href ).hasCircular = {
	// 				// todo: link this up with some more info
	// 				key: true
	// 			};
	// 		}
	//
	// 		// external page
	// 		cache.get( 'nodes' ).set(
	// 			refHost.href,
	// 			{
	// 				status: resp._status,
	// 				hostname: refHost,
	// 				external: refHost.hostname !== parent.hostname,
	// 				parent: parent.href
	// 			}
	// 		);
	// 	}
	// );
}

( async () => {
	const browser = await puppeteer.launch( {
		slowMo: 250
	} );

	// const page = await browser.newPage();
	// TODO: add directives for spell check, 404, evaluate for size, screenshot, website indexing etc.

	// const x = await page.goto( 'https://docs.aws.amazon.com/' );
	// await page.screenshot( { path: 'example.png' } );
	// const url    = 'https://parellin-technologies-llc.github.io/lightmap/';

	const cache  = new LightMap();
	const url    = 'http://localhost:8080/';
	const parent = new URL( url );

	console.log( parent );

	// const x      = await page.goto( url, { waitUntil: 'networkidle2' } );
	// cache.set( 'ip', x._remoteAddress.ip );
	// cache.set( 'port', x._remoteAddress.port );
	// const dimensions = await page.evaluate( () => {
	// 	return {
	// 		width: document.documentElement.clientWidth,
	// 		height: document.documentElement.clientHeight,
	// 		deviceScaleFactor: window.devicePixelRatio
	// 	};
	// } );
	// cache.set( 'dimensions', dimensions );

	// cache.set( 'security', [ x._securityDetails ] );
	cache.set( 'nodes', new LightMap( [
		[ parent.href, {
			// status: x._status,
			hostname: parent,
			parent: null
		} ]
	] ) );

	await searchForLinks( browser, parent, cache );

	// const walk = await page.evaluate( () => {
	// 	const data = {
	// 		pendingNavigation: [],
	// 		dom: [],
	// 		log: []
	// 	};
	//
	// 	console.log = function( ...args ) {
	// 		data.log.push( ...args );
	// 	};
	//
	//
	// 	window.addEventListener( 'popstate', href => {
	// 		data.pendingNavigation.push( href );
	// 	} );
	//
	// 	function nodeToText( node ) {
	// 		data.dom.push( new XMLSerializer().serializeToString( node ) );
	// 	}
	//
	// 	function walkTheDOM( node, func ) {
	// 		func( node );
	// 		node = node.firstChild;
	// 		while( node ) {
	// 			walkTheDOM( node, func );
	// 			node = node.nextSibling;
	// 		}
	// 	}
	//
	// 	walkTheDOM( document.body, function( node ) {
	// 		// if( node.nodeType === 3 ) { // Is it a Text node?
	// 		// data.push( node.data.trim() );
	// 		// data.push( node );
	// 		nodeToText( node );
	// 		node.click();
	// 		// }
	// 	} );
	//
	// 	return data;
	// } );
	//
	// console.log( walk.pendingNavigation );
	// console.log( walk.log );

	console.log( cache );

	await writeFile( './logs.json', JSON.stringify( cache.toJSON(), null, 4 ) );

	await browser.close();
} )();
