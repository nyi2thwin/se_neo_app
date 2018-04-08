'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
	_clinicId: Schema.Types.ObjectId,
	_userId: Schema.Types.ObjectId,
	username: String,
	content: String,
	rating: Number,
	datetime: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", ReviewSchema);