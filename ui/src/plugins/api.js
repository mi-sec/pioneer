import Vue from 'vue';

class Api
{
	setBaseUrl( url )
	{
		this.baseUrl = url;
	}

	request( params ) {
		let data;

		if ( Array.isArray( params.data ) ) {
			data = params.data;
		}
		else {
			data = {
				...params.data
			};
		}

		return Vue.prototype.$http( {
			url: params.path,
			baseURL: this.baseUrl,
			method: params.method || 'get',
			maxRedirects: 20,
			params: {
				...params.params
			},
			data
		} );
	}

	getConfig() {
		const params = {
			path: '/config',
			method: 'get'
		};

		return this.request( params )
			.then( resp => resp.data )
			.catch( err => {
				console.log( err );
			} );
	}

	getVersion() {
		const params = {
			path: '/version',
			method: 'get'
		};

		return this.request( params )
			.then( resp => resp.data )
			.catch( err => {
				console.log( err );
			} );
	}

	getScanSummary( _id = '' ) {
		const params = {
			path: `/task${ _id ? '/' + _id : '' }/summary`,
			method: 'get'
		};

		return this.request( params )
			.then( resp => resp.data );
	}

	getScan( _id = '' ) {
		const params = {
			path: `/task${ _id ? '/' + _id : '' }`,
			method: 'get'
		};

		return this.request( params )
			.then( resp => resp.data );
	}

	deleteScan( _id ) {
		const params = {
			path: `/task/${ _id }`,
			method: 'delete'
		};

		return this.request( params )
			.then( resp => resp.data );
	}
}

Vue.use( {
	install() {
		Vue.prototype.$api = new Api();

		Vue.prototype.$installApi = function() {
			this.$store.$api = Vue.prototype.$api;
		};
	}
} );
