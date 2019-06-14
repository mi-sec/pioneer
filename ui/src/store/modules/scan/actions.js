export default {
	async listScans( context ) {
		try {
			const data = await this.$api.getScanSummary();
			context.commit( 'commitScans', data );
		} catch ( e ) {
			console.error( e );
		}
	},
	async getScan( context, _id = '' ) {
		try {
			const data = await this.$api.getScan( _id );
			context.commit( 'commitScan', data );
		} catch ( e ) {
			console.error( e );
		}
	},
	async deleteScan( context, _id ) {
		try {
			await this.$api.deleteScan( _id );
			context.commit( 'commitRemoveScan', _id );
		} catch ( e ) {
			console.error( e );
		}
	}
};
