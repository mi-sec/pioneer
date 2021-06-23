// https://vuex.vuejs.org/en/getters.html

export default {
    getIsReady( state ) {
        return state.isReady;
    },
    getConfig( state ) {
        return state.config;
    }
};
