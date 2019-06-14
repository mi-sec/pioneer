import moment from 'moment';

export default {
	getScans( state ) {
		return state.scans.map(
			scan => {
				scan.config.plugins = scan.config.plugins
					.map( i => i.module )
					.join( ', ' );

				scan.updatedAt = moment( scan.updatedAt ).format( 'MMMM Do YYYY, h:mm:ss a' );
				return scan;
			}
		);
	},

	getCurrentScan( state ) {
		if ( !state.currentScan || !state.loadedScans.has( state.currentScan ) ) {
			return null;
		}

		const scan = state.loadedScans.get( state.currentScan );

		if ( scan.data.response.securityDetails ) {
			let suite = [];

			suite.push( scan.data.response.securityDetails.protocol.replace( /\d+(.*)/, '' ).trim() );
			suite.push( scan.data.response.securityDetails.keyExchange.trim() );
			suite.push( 'WITH' );
			suite.push( scan.data.response.securityDetails.cipher.trim() );

			scan.data.response.securityDetails.cipherSuite = suite.join( '_' );

			if ( Array.isArray( scan.data.response.securityDetails.sanList ) ) {
				scan.data.response.securityDetails.sanList = scan.data.response.securityDetails.sanList.join( ', ' );
			}

			scan.data.response.securityDetails.validFrom = moment(
				scan.data.response.securityDetails.validFrom * 1000
			)
				.utc()
				.format( 'ddd, D MMM YYYY HH:mm:ss z' );

			scan.data.response.securityDetails.validTo = moment(
				scan.data.response.securityDetails.validTo * 1000
			)
				.utc()
				.format( 'ddd, D MMM YYYY HH:mm:ss z' );
		}

		return scan;
	}
};
