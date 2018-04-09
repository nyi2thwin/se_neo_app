'use strict';
var mongoose = require('mongoose'),
	Booking = mongoose.model('Booking'),
	User = mongoose.model('User'),
	request = require('request');


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


exports.deleteBooking = function(req, res) {
	Booking.remove({
	    _id: req.body.bookingId
	}, function(err, clinic) {
	    if (err)
	    	return res.send(err);
	    res.json({ message: 'Booking successfully removed' });
	});
};

exports.sendNotification = function(req, res) {
	//send whatapp or telegram msg code here
	Booking.findOne({_id:req.body.bookingId}, function(err,booking) {
		if(err)
			res.send(err);
		User.findOne({userId:booking.userId}, function(err,user) {
			if(err)
					res.send(err);
				res.json({ message: 'Notification successfully sent to '+user.contact+"!" });
			});
	});
};