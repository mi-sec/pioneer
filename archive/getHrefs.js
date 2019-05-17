/** ****************************************************************************************************
 * File: getHrefs.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-May-2019
 *******************************************************************************************************/
'use strict';

async function getHrefs( page ) {
	return await page.evaluate( () => {
		const anchors = document.querySelectorAll( 'a' );
		return [].map.call( anchors, a => a.href );
	} );
}
