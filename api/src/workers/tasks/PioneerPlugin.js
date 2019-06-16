/** ****************************************************************************************************
 * File: PioneerPlugin.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Jun-2019
 *******************************************************************************************************/
'use strict';

class PioneerPlugin
{
	#config = null;
	#result = null;

	constructor( config )
	{
		this.#config = config;
	}

	getResults()
	{
		return this.#result;
	}

	setResults( v )
	{
		console.log( 'setResults', v );
		this.#result = v;
	}

	init()
	{

	}

	onPreBrowserLaunch()
	{

	}

	onPostBrowserLaunch()
	{

	}

	onPostPageLoaded()
	{

	}

	onPreBrowserClose()
	{

	}

	onPostBrowserClose()
	{

	}

	onPrePageInit()
	{

	}

	onPostPageInit()
	{

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

	onNetworkRequestWillBeSent()
	{

	}

	onNetworkRequestIntercepted()
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
