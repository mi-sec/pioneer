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
	LightMap  = require( '@mi-sec/lightmap/lightmap' );

const ScanWebsite            = require( './ScanWebsite' );
const ScanPage               = require( './ScanPage' );
const spellCheck             = require( '../plugins/spellcheck' );
const scanForNavigationLinks = require( '../plugins/scanForNavigationLinks' );
const Resource               = require( './Resource' );

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
		// baseUrl: 'https://parellin-technologies-llc.github.io/lightmap/',
		pageOpts: {
			disableExternalLoading: true
		}
	} );

	await scan.init();
	await scan.scan();

	await writeFile( './scantree.json', JSON.stringify( scan.cache, null, 4 ) );

	let i         = 0;
	const data    = scan.cache;
	const
		entryNode = data.get( 'nodes' ).get( data.get( 'baseUrl' ) ),
		rootNode  = new Resource( entryNode );

	rootNode.id = i++;

	function mapNodeLinks( node ) {
		if ( !node.hasOwnProperty( 'children' ) ) {
			return node;
		}

		return node.children.map(
			link => {
				if ( data.get( 'nodes' ).has( link.url ) ) {
					const _node    = new Resource( data.get( 'nodes' ).get( link.url ) );
					_node.id       = i++;
					_node.children = mapNodeLinks( _node );
					return _node;
				}
				else {
					link.id = i++;
					return link;
				}
			}
		);
	}

	rootNode.children = mapNodeLinks( rootNode );
	await writeFile( './ui/public/treeData.json', JSON.stringify( rootNode, null, 4 ) );

	await browser.close();
} )();
