/** ****************************************************************************************************
 * File: scanForNavigationLinks.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-May-2019
 *******************************************************************************************************/
'use strict';

async function scanForNavigationLinks( page ) {
	return await page.evaluate(
		() => Array.from(
			Object.keys( document.links )
				.map( k => ( {
					type: 'navigation',
					url: document.links[ k ].href
				} ) )
		)
	);
}

module.exports = scanForNavigationLinks;
