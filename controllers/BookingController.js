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
				var toContact = "+65"+user.contact;
				var username = "AC0f15abf92c5e30938d7f8990736f26e6";
				var password = "425ad2653fc524626d6933139cd12ed2";
				
				var bodymsg = "Your queue number is in 5 min!";
				
				var options = {
							    url: 'https://api.twilio.com/2010-04-01/Accounts/AC0f15abf92c5e30938d7f8990736f26e6/Messages.json',
							    method: 'POST',
							    auth: {
							        'user': username,
							        'pass': password
							    },
							    form: {
							        To: toContact,
							        From: '+19122449810',
							        Body: bodymsg
							    },
							    headers: {
							        'Accept': '*/*'
							    }
							};
				request(options,
				    function (error, response, body) {
				        if (!error && response.statusCode == 200) {
				            console.log(body)
				        }
				    }
				);
				res.json({ message: 'Notification successfully sent to '+toContact+"!" });
			});
	});
};