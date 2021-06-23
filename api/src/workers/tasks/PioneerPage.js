/** ****************************************************************************************************
 * File: PioneerPage.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Jun-2019
 *******************************************************************************************************/
'use strict';

const
    config      = require( 'config' ),
    lighthouse  = require( 'lighthouse' ),
    uuid        = require( 'uuid' ),
    LightMap    = require( '@mi-sec/lightmap' ),
    { resolve } = require( 'path' ),
    { getId }   = require( './utils' );

class PioneerPage
{
    #config     = null;
    #browser    = null;
    #page       = null;
    #cdpSession = null;
    #data       = null;

    constructor( url, config )
    {
        this.#config = config;

        this.id   = getId();
        this.url  = url;
        this.type = '';

        this.entryResourceRequestId = null;
        this.external               = false;

        this.auditReport     = null;
        this.consoleMsg      = [];
        this.children        = [];
        this.navigationLinks = [];
        this.plugins         = [];
        this.resources       = new LightMap();
    }

    formatURL()
    {
        if ( typeof this.url === 'object' ) {
            if ( this.url.hasOwnProperty( 'url' ) ) {
                this.url = this.url.url;
            }
        }

        this.url      = new URL( this.url );
        this.url.hash = '';
        this.url      = this.url.href;
    }

    async init( browser )
    {
        this.formatURL();

        this.#browser = browser;
        this.#page    = await this.#browser.newPage();

        await this.#page.setRequestInterception( true );
        this.#page.on( 'request', this._request.bind( this ) );
        this.#page.on( 'requestfailed', this._requestfailed.bind( this ) );
        this.#page.on( 'response', this._response.bind( this ) );
        this.#page.on( 'domcontentloaded', this._domcontentloaded.bind( this ) );
        this.#page.on( 'requestfinished', this._requestfinished.bind( this ) );
        this.#page.on( 'console', this._console.bind( this ) );

        this.#cdpSession = await this.#page.target().createCDPSession();

        await this.#cdpSession.send( 'Network.enable' );
        await this.#cdpSession.send( 'Network.setRequestInterception', {
            patterns: [ { urlPattern: '*' } ]
        } );

        await this.#cdpSession.on( 'Network.requestWillBeSent', async e => {
            if ( !this.entryResourceRequestId ) {
                this.entryResourceRequestId = e.requestId;
            }

            this.createResourceEntry( e.requestId );
            this.resources.get( e.requestId ).request = e;
        } );

        await this.#cdpSession.on( 'Network.requestIntercepted', async e => {
            this.createResourceEntry( e.requestId );
            this.resources.get( e.requestId ).intercepted = e;

            await this.#cdpSession.send( 'Network.continueInterceptedRequest', {
                interceptionId: e.interceptionId
            } );
        } );

        await this.#cdpSession.on( 'Network.responseReceived', async e => {
            this.resources.get( e.requestId ).response = e;
        } );
    }

    createResourceEntry( id )
    {
        if ( !this.resources.has( id ) ) {
            this.resources.set( id, {
                request: null,
                intercepted: null,
                response: null
            } );
        }
    }

    async goto()
    {
        this.#data = await this.#page.goto( this.url, {
            timeout: this.#config.pageOpts.timeout,
            waitUntil: this.#config.pageOpts.waitUntil,
            referer: this.#config.pageOpts.referer
        } );
    }

    _page()
    {
        return this.#page;
    }

    _request( request )
    {
        console.log( 'on:request' );
        request.continue();
    }

    _requestfailed( request )
    {
        console.log( 'on:requestfailed' );
    }

    _response( response )
    {
        console.log( 'on:response' );
    }

    _domcontentloaded()
    {
        console.log( 'on:domcontentloaded' );
    }

    _requestfinished()
    {
        console.log( 'on:requestfinished' );
    }

    async _console( msg )
    {
        const payload = [];

        for ( const arg of msg.args() ) {
            const val = await arg.jsonValue();
            payload.push( val );
        }

        this.consoleMsg.push( payload );
    }

    async execPlugins()
    {
        for ( let i = 0; i < this.#config.plugins.length; i++ ) {
            const plugin = this.#config.plugins[ i ];

            if ( plugin.module === 'screenshot' ) {
                await this.takeScreenshot( plugin.opts );
            }
            else if ( plugin.module === 'pdf' ) {
                await this.printToPDF( plugin.opts );
            }
            else if ( plugin.module === 'audit' ) {
                await this.runAudit( plugin.opts );
            }
        }
    }

    generateStoragePath( ext = '' )
    {
        const id = uuid.v4();

        return {
            filePath: resolve( config.get( 'storage.path' ), `${ id }${ ext }` ),
            apiPath: `${ config.get( 'storage.apiRoute' ) }${ id }${ ext }`
        };
    }

    // See https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions
    async takeScreenshot( opts = {} )
    {
        const
            pathInfo = this.generateStoragePath( '.png' );

        await this.#page.screenshot( {
            ...opts,
            path: pathInfo.filePath
        } );

        this.plugins.push( {
            module: 'screenshot',
            ...pathInfo
        } );
    }

    // See https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
    async printToPDF( opts = {} )
    {
        const
            pathInfo = this.generateStoragePath( '.pdf' );

        await this.#page.pdf( {
            ...opts,
            path: pathInfo.filePath
        } );

        this.plugins.push( {
            module: 'pdf',
            ...pathInfo
        } );
    }

    async runAudit( opts = {} )
    {
        // TODO::: make a gif of the paint sequence using screenshot-thumbnails
        opts.extends  = opts.extends || 'lighthouse:default';
        opts.settings = opts.settings || {
            skipAudits: [ 'screenshot-thumbnails', 'final-screenshot' ]
        };

        const { lhr } = await lighthouse(
            this.url,
            {
                port: ( new URL( this.#browser.wsEndpoint() ) ).port,
                output: 'json',
                logLevel: 'info'
            },
            opts
        );

        this.auditReport = lhr;
    }

    async scanForNavigationLinks()
    {
        this.navigationLinks = await this.#page.evaluate(
            () => Array.from(
                Object.keys( document.links )
                    .map( k => ( {
                        type: 'navigation',
                        url: document.links[ k ].href
                    } ) )
            )
        );
    }
}

module.exports = PioneerPage;
