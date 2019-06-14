/** ****************************************************************************************************
 * File: PioneerPlugin.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Jun-2019
 *******************************************************************************************************/
'use strict';

/**
 * Create plugins that extend from this - call each plugin per method
 * Example
 * await this.#cdpSession.on( 'Network.requestWillBeSent', async e => {
 * 		plugins.forEach( plugin => plugin.onNetworkRequestWillBeSent( e ) );
 * } );
 */
class PioneerPlugin
{
	#config = null;

	constructor( config )
	{
		this.#config = config;
	}

	onRequest()
	{

	}

	onRequestFailed()
	{

	}

	onResponse()
	{

	}

	onDomContentLoaded()
	{

	}

	onRequestFinished()
	{

	}

	onConsole()
	{

	}

	onNetworkRequestIntercepted()
	{

	}

	onNetworkRequestWillBeSent()
	{

	}

	onNetworkResponseReceived()
	{

	}

	preGoto()
	{

	}

	postGoto()
	{

	}
}

module.exports = PioneerPlugin;
