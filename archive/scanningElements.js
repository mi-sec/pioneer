/** ****************************************************************************************************
 * File: scanningElements.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-May-2019
 *******************************************************************************************************/
'use strict';

// url: new URL( 'view-source:http://localhost:8080/' ),
// url: new URL( 'http://google.com' ),

// const page = await browser.newPage();
// const x = await page.goto( 'https://docs.aws.amazon.com/' );
// await page.screenshot( { path: 'example.png' } );
// const url    = 'https://parellin-technologies-llc.github.io/lightmap/';

// info.external      = url.hostname !== parent.hostname;
// const x = new ScanPage( {
// 	browser,
// 	url: new URL( 'http://localhost:8080/' ),
// 	disableExternalLoading: true
// } );
//
// await x.init();
// await x.goto();
// await x.getPageDimensions();
// await x.scanForNavigationLinks();
// const misspelledWords = await spellCheck( x.page );
// console.log( `${ misspelledWords.length } misspelled words` );
//
// // console.log( x );
// console.log( x.cache );


// await this.page.waitFor( 500 );

// const cache  = new LightMap();
// const url    = 'http://localhost:8080/';
// const parent = new URL( url );
//
// console.log( parent );

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
// cache.set( 'nodes', new LightMap( [
// 	[ parent.href, {
// 		// status: x._status,
// 		hostname: parent,
// 		parent: null
// 	} ]
// ] ) );

// await searchForLinks( browser, parent, cache );

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
// console.log( cache );
