'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	userId: {
		type:String,
		required: 'Kindly enter NRIC'
	},
	email: {
		type:String,
		required: 'Kindly enter email'
	},
	name: {
		type:String,
		required: 'Kindly enter user name'
	},
	contact: {
		type:Number,
		required: 'Kindly enter contact no.'
	},
	dob: {
		type:Date
	},
	password: {
		type:String,
		required: 'Kindly enter password'
	}
});

module.exports = mongoose.model('User', UserSchema);
