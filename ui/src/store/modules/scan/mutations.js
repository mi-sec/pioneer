export default {
	commitScans( state, scans ) {
		state.scans = scans;
	},
	commitScan( state, scan ) {
		state.loadedScans.set( scan._id, scan );
	},

	setCurrentScan( state, _id ) {
		state.currentScan = _id;
	}
};
