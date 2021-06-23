// Lib imports
import Vue  from 'vue';
import Vuex from 'vuex';

// Store functionality
import actions   from './actions';
import getters   from './getters';
import modules   from './modules';
import mutations from './mutations';
import state     from './state';

Vue.use( Vuex );

// Create a new store
export default new Vuex.Store( {
    actions,
    getters,
    modules,
    mutations,
    state
} );
