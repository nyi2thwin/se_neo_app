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
		type:Date
	},
	queNo: {
		type:Number
	},
	stauts: {
		type:String
	},
	estimatedTime: {
		type:Number
	}
});

module.exports = mongoose.model('Booking', BookingSchema);
