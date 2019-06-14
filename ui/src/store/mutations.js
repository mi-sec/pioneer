// https://vuex.vuejs.org/en/mutations.html

export default {
	setIsReady( state, isReady ) {
		state.isReady = isReady;
	},
	commitLocalConfig( state, config ) {
		config.protocol = config.protocol || window.location.protocol;
		config.hostname = config.hostname || window.location.hostname;
		config.port     = config.port || 80;
		config.pathname = config.pathname || '/api';

		config.url        = `${ config.protocol }://${ config.hostname }:${ config.port }${ config.pathname }`;
		state.localConfig = config;

		this.$api.setBaseUrl( state.localConfig.url );
	},
	commitConfig( state, config ) {
		state.config = config;
	}
};
