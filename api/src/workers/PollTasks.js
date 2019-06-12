/** ****************************************************************************************************
 * File: PollTasks.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Jun-2019
 *******************************************************************************************************/
'use strict';

const
	{ Worker }  = require( 'worker_threads' ),
	{ resolve } = require( 'path' ),
	config      = require( 'config' ),
	LightMap    = require( '@mi-sec/lightmap' ),
	opts        = config.get( 'workers.polling' );

const
	{ waitFor } = require( '../utils/general' ),
	MongoDB     = require( '../services/mongo/MongoDB' );

const
	Scheduler = require( './Scheduler' );

const
	workerFile = resolve( __dirname, './tasks/Scan.js' );

class PollTasks extends Scheduler
{
	constructor()
	{
		super( { frequency: opts.frequency } );
		this.config = opts;

		this.tasks = new LightMap();

		this.setTask();
	}

	async start()
	{
		console.debug( `${ this.constructor.name } started` );

		try {
			await waitFor( async () => {
				await MongoDB.connect();
				return MongoDB.isConnected();
			}, 2000, true );
		} catch ( e ) {
			console.error( e );
		}

		console.debug( 'mongo connected' );

		return super.start();
	}

	async stop()
	{
		console.debug( `${ this.constructor.name } stopped` );
		await MongoDB.disconnect();
		return super.stop();
	}

	async pendingTasks()
	{
		const Queue = MongoDB.collections.get( 'queue' );
		return await Queue.find( { state: 'PENDING' } );
	}

	setTask()
	{
		const fn = async () => {
			const pendingTasks = await this.pendingTasks();

			if ( pendingTasks.length ) {
				this.pause();
				try {
					// spawn worker

					for ( let i = 0; i < pendingTasks.length; i++ ) {
						const
							task   = pendingTasks[ i ],
							worker = new Worker( workerFile, {
								workerData: task.config
							} );

						worker
							.on( 'online', async () => {
								console.log( 'WORKER online' );
							} )
							.on( 'message', async d => {
								console.log( 'WORKER message' );
								console.log( d );

								task.state = d.state;
								await task.save();
							} )
							.on( 'error', async e => {
								console.log( 'WORKER error' );
								console.log( e );
								task.state      = 'FAILED';
								task.data.error = e;
								await task.save();
							} )
							.on( 'exit', async code => {
								console.log( 'WORKER exit' );
								task.data.exitcode = code;
								console.log( task );
								await task.save();

								this.tasks.delete( task._id );
							} );

						this.tasks.set( task._id, worker );
					}
				} catch ( e ) {
					console.error( `${ this.constructor.name } error`, e );
				} finally {
					this.resume();
				}
			}
		};

		super.setTask( fn, this );
	}
}

module.exports = new PollTasks();
