'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema =new Schema({
  clinicId: Number,
  userId: Number,
  content: String,
  rating: Number,
  datetime: Date
});

module.exports("Review", ReviewSchema);