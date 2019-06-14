// https://vuex.vuejs.org/en/getters.html

export default {
	getIsReady( state ) {
		return state.isReady;
	},
	getLocalConifg( state ) {
		return state.localConfig;
	},
	getConfig( state ) {
		return state.config;
	}
};
