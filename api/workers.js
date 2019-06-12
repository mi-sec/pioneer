/** ****************************************************************************************************
 * File: workers.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	io     = require( '@pm2/io' ),
	Server = require( './src/core/Server' );

const
	onStart = require( './src/hooks/onStart' ),
	onStop  = require( './src/hooks/onStop' );

const
	PollTasks = require( './src/workers/PollTasks' );

class Workers extends io.Entrypoint
{
	// This is the very first method called on startup
	async onStart( cb )
	{
		// do any initialization steps here
		await onStart();

		process
			.on( 'SIGINT', async ( msg, code ) => {
				await PollTasks.stop();
				process.exit( code );
			} )
			.on( 'SIGQUIT', ( msg, code ) => ( console.log( msg, code ), process.exit( code ) ) )
			.on( 'SIGTERM', ( msg, code ) => ( console.log( msg, code ), process.exit( code ) ) )
			.on( 'unhandledRejection', err => console.log( 'unhandledRejection', err ) )
			.on( 'uncaughtException', err => console.log( 'uncaughtException', err ) )
			.on( 'beforeExit', () => console.log( 'beforeExit' ) )
			.on( 'exit', () => console.log( 'exit' ) );

		await PollTasks.start();

		process.send( 'ready' );
		cb();

	}

	// This is the very last method called on exit || uncaught exception
	async onStop( err, cb, code, signal )
	{
		await PollTasks.stop();
		await onStop();
	}

	// Here we declare some process metrics
	sensors()
	{
	}

	// Here are some actions to interact with the app in live
	actuators()
	{
	}
}

module.exports = new Workers();
