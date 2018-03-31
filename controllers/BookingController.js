'use strict';
var mongoose = require('mongoose'),
	Booking = mongoose.model('Booking');


exports.findBookingByClinicId = function(req,res){
	Booking.find({clinicId:req.body.clinicId}, function(err,booking) {
		if(err)
			res.send(err);
		res.json(booking);
	});
};

exports.createNewBooking = function(req,res){
	var new_booking = new Booking(req.body);
	new_booking.save(function(err,booking) {
		if(err)
			res.send(err);
		res.json(booking);
	});
};
