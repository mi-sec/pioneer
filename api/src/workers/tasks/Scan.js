/** ****************************************************************************************************
 * File: ScanPage.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	{
		isMainThread,
		parentPort,
		workerData
	} = require( 'worker_threads' );

console.log( 'isMainThread', isMainThread );

( async () => {
	try {
		parentPort.postMessage( { state: 'IN_PROGRESS' } );

		console.log( 'workerData', workerData );

		setTimeout( () => {
			parentPort.postMessage( { state: 'COMPLETE' } );
		}, 2000 );
	} catch ( e ) {
		parentPort.postMessage( { state: 'FAILED' } );
	}
} )();
