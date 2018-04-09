'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookingSchema = new Schema({
	clinicId: {
		type:String,
		required: 'Kindly enter ClinicId'
	},
	userId: {
		type:String,
		required: 'Kindly enter NRIC'
	},

	dateTime: {
		type:Date,
		required: 'Kindly enter DateTime'
	},
	queNo: {
		type:Number,
		required: 'Kindly enter queNo'
	},
	status: {
		type:String,
		required: 'Kindly enter status'
	},
	estimatedTime: {
		type:Number
	}
});

module.exports = mongoose.model('Booking', BookingSchema);
