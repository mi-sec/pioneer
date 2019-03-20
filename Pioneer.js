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

async function searchForLinks( page, ourl, cache ) {
	const hrefs = await getHrefs( page );
	
	hrefs.forEach(
		async ref => {
			const host = new URL( ref );
			
			console.log( host );
			
			ref = await page.goto( ref );
			
			// external page
			if( host.hostname !== ourl.hostname ) {
				cache.get( 'nodes' ).set( host.href, {
					status: ref._status,
					hostname: host,
					external: true
				} );
			} else if( cache.has( host.href ) ) {
				cache.get( 'nodes' ).get( host.href ).hasCircular = true;
			}
			
		}
	);
}

( async () => {
	const browser = await puppeteer.launch( {
		slowMo: 250
	} );
	
	const page = await browser.newPage();
	
	// const x = await page.goto( 'https://docs.aws.amazon.com/' );
	// await page.screenshot( { path: 'example.png' } );
	
	const cache = new LightMap();
	const url   = 'https://parellin-technologies-llc.github.io/lightmap/';
	const ourl  = new URL( url );
	const x     = await page.goto( url );
	
	// console.log( x );
	
	cache.set( 'ip', x._remoteAddress.ip );
	cache.set( 'port', x._remoteAddress.port );
	
	const dimensions = await page.evaluate( () => {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight,
			deviceScaleFactor: window.devicePixelRatio
		};
	} );
	
	cache.set( 'dimensions', dimensions );
	cache.set( 'security', [ x._securityDetails ] );
	cache.set( 'nodes', new LightMap( [
		[ url, {
			status: x._status,
			hostname: ourl,
			base: true
		} ]
	] ) );
	
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
	
	console.log( await searchForLinks( page, ourl, cache ) );
	
	
	console.log( cache );
	
	await writeFile( './logs.json', JSON.stringify( cache.toJSON(), null, 4 ) );
	
	await browser.close();
} )();
