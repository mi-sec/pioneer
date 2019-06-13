/** ****************************************************************************************************
 * File: Queue.js
 * Project: pioneer
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 11-Apr-2019
 *******************************************************************************************************/
'use strict';

const
	mongoose = require( 'mongoose' ),
	Schema   = mongoose.Schema;

const queueSchema = new Schema(
	{
		_id: Schema.Types.ObjectId,
		state: {
			type: String,
			enum: [ 'PENDING', 'IN_PROGRESS', 'STALLED', 'FATAL', 'FAILED', 'COMPLETE' ],
			default: 'PENDING'
		},
		config: Object,
		data: {
			type: Object,
			default: {}
		},
		error: Object
	},
	{
		timestamp: true
	}
);

module.exports = mongoose.models.queue || mongoose.model( 'queue', queueSchema );
