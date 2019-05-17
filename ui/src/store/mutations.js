// https://vuex.vuejs.org/en/mutations.html

export default {
	commitConfig( state, config ) {
		config.url   = `${ config.protocol }://${ config.hostname }:${ config.port }${ config.pathname }`;
		state.config = config;
	}
};
