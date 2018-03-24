'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookingSchema = new Schema({
  clinicId: Number,
  dateTime: Date,
  userId: Number,
  queNo: Number,
  status: String,
  estimatedTime: Date
});

BookingSchema.save(function(err){
  if(err) throw err;

  console.log("Booking is saved.");
});

module.exports = mongoose.model('User', UserSchema);