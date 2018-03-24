'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClinicSchema = new Schema({
  name: String,
  address: String,
  postalCode: Number,
  doctors: [String],
  startTime: Date,
  endTime: Date
});

module.exports= mongoose.model("Clinic", ClinicSchema);