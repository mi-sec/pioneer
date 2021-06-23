/** ****************************************************************************************************
 * File: Scheduler.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Jun-2019
 *******************************************************************************************************/
'use strict';

class Scheduler
{
    constructor( opts = {} )
    {
        this.frequency = opts.frequency || 1000;
        this.task      = opts.task || ( () => {} );
        this.timer     = null;
        this.running   = false;
    }

    isRunning()
    {
        return this.running;
    }

    restartTimer()
    {
        if ( !this.isRunning() ) {
            this.running = true;
            this.timer   = setInterval( this.task, this.frequency );
        }

        return this.timer;
    }

    start()
    {
        return this.restartTimer();
    }

    resume()
    {
        return this.restartTimer();
    }

    pause()
    {
        this.running = false;
        return clearInterval( this.timer );
    }

    stop()
    {
        this.running = false;
        return clearInterval( this.timer );
    }

    setTask( fn, bindTo )
    {
        this.task = fn.bind( bindTo );
    }
}

module.exports = Scheduler;
