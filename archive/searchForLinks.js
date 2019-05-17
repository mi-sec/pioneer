/** ****************************************************************************************************
 * File: searchForLinks.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-May-2019
 *******************************************************************************************************/
'use strict';

async function searchForLinks( browser, parent, cache ) {
	console.log( 'searchForLinks' );

	const page = await browser.newPage();
	await page.setRequestInterception( true );

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
		} else if( url.hostname !== parent.hostname ) {
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
		} else {
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
