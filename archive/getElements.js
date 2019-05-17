/** ****************************************************************************************************
 * File: getElements.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-May-2019
 *******************************************************************************************************/
'use strict';

async function scanAllText() {
	console.log( 'scanAllText' );
	// $("body").find('*')
	const handle         = await this.page.evaluateHandle( () => ( { window, document } ) );
	const properties     = await handle.getProperties();
	const windowHandle   = properties.get( 'window' );
	const documentHandle = properties.get( 'document' );
	// console.log( windowHandle );
	console.log();
	console.log();
	// console.log( documentHandle );
	console.log();
	console.log();
	console.log( await ( await windowHandle.getProperty( 'textContent' ) ).jsonValue() );

	// const element = await this.page.$( '.scrape' );
	const element = await documentHandle.$( 'body' );
	// const text    = await ( await element.getProperty( 'textContent' ) ).jsonValue();
	console.log( element );
	// console.log( JSON.stringify( text, null, 4 ) );

	const text = await this.page.evaluate(
		() => Array.from(
			document.querySelectorAll( 'body' ),
			element => ( {
				nodeName: element.nodeName,
				nodeType: element.nodeType,
				nodeValue: element.nodeValue,
				textContent: element.textContent
			} )
		)
	);

	console.log( text );

	await handle.dispose();

	// const element = await this.page.$( 'body' );
	// console.log( element );

	// const values = await this.page.evaluate(
	// 	() => [ ...document.querySelectorAll( '*' ) ]
	// 		.map( element => element.getProperty( 'textContent' ) )
	// );
	//
	// console.log( values );

	// console.log( ( await element.getProperty( 'textContent' ) ) );
}

const x = new ScanPage( {
	browser,
	url: new URL( 'http://localhost:8080/' ),
	disableExternalLoading: true
} );
