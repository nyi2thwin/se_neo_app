'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClinicSchema = new Schema({
	name: String,
	address: String,
	postalCode: Number,
	lat: Number,
	long: Number,
	doctors: [String],
	startTime: String, //10:00
	endTime: String // 18:00
});

module.exports= mongoose.model("Clinic", ClinicSchema);