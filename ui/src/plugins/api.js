import Vue from 'vue';

class Api
{
    constructor( url )
    {
        this.baseUrl = url;
    }

    getBaseUrl()
    {
        return this.baseUrl;
    }

    request( params )
    {
        let data;

        if ( Array.isArray( params.data ) ) {
            data = params.data;
        }
        else {
            data = {
                ...params.data
            };
        }

        return Vue.prototype.$axios( {
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

    createScan( opts ) {
        const params = {
            path: '/task',
            method: 'post',
            data: {
                ...opts
            }
        };

        return this.request( params )
            .then( resp => resp.data );
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
        Vue.prototype.$api = new Api( process.env.VUE_APP_API_URL );

        Vue.prototype.$installApi = function() {
            this.$store.$api = Vue.prototype.$api;
        };
    }
} );
