'use strict';

const
    { Worker } = require( 'worker_threads' ),
    path       = require( 'path' ),
    config     = require( 'config' ),
    LightMap   = require( '@mi-sec/lightmap' ),
    opts       = config.get( 'workers.polling' );

const
    { waitFor } = require( '../utils/general' ),
    logger      = require( '../services/logger' ),
    MongoDB     = require( '../services/MongoDB' );

const
    Scheduler = require( './Scheduler' );

const
    workerFile = path.resolve( __dirname, './tasks/ScanTask.js' );

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
        logger.trace( `${ this.constructor.name } started` );

        try {
            await waitFor( async () => {
                await MongoDB.connect();
                return MongoDB.isConnected();
            }, 2000, true );
        }
        catch ( e ) {
            logger.error( e );
        }

        logger.trace( 'mongo connected' );

        return super.start();
    }

    async stop()
    {
        logger.trace( `${ this.constructor.name } stopped` );
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

                    // Make reporting system from worker to see if it's still alive
                    for ( let i = 0; i < pendingTasks.length; i++ ) {
                        const
                            task   = pendingTasks[ i ],
                            worker = new Worker( workerFile, {
                                workerData: task.config
                            } );

                        worker
                            .on( 'online', async () => {
                                logger.trace( 'WORKER online' );
                            } )
                            .on( 'message', async ( msg ) => {
                                logger.trace( 'WORKER recieved message', msg );
                                task.state = msg.state;
                                task.data  = msg.data;

                                if ( msg.error ) {
                                    task.error = msg.error;
                                }

                                await task.save();
                            } )
                            .on( 'error', async ( err ) => {
                                logger.trace( 'WORKER recieved error', err );
                                task.state = 'FATAL';
                                task.error = err;
                                await task.save();
                            } )
                            .on( 'exit', () => {
                                logger.trace( 'WORKER exited' );
                                this.tasks.delete( task._id );
                            } );

                        this.tasks.set( task._id, worker );
                    }
                }
                catch ( e ) {
                    logger.error( `${ this.constructor.name } error`, e );
                }
                finally {
                    this.resume();
                }
            }
        };

        super.setTask( fn, this );
    }
}

module.exports = new PollTasks();
