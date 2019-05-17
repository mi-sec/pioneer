// https://vuex.vuejs.org/en/actions.html

import axios from 'axios';

export default {
	async loadConfig( context ) {
		try {
			const { data } = await axios.get( '/config.json' );
			context.commit( 'commitConfig', data );
		} catch( e ) {
			console.error( e );
		}
	}
};
