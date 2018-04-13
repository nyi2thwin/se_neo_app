'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	nric: {
		type:String,
		required: 'Kindly enter NRIC',
		index: {unique: true}
	},
	email: {
		type:String,
		required: 'Kindly enter email',
		index: {unique: true}
	},
	name: {
		type:String,
		required: 'Kindly enter user name'
	},
	contact: {
		type:Number,
		required: 'Kindly enter contact no.',
		index: {unique: true}
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
