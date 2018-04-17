'use strict';
var mongoose = require('mongoose'),
	Booking = mongoose.model('Booking'),
	Clinic = mongoose.model('Clinic'),
	User = mongoose.model('User'),
	request = require('request');

exports.findBookingByClinicIdAndStatus = function(req,res){
	Booking.find({clinicId:req.body.clinicId, status:req.body.status}, function(err,bookings) {
		if(err)
			res.send(err);
		//res.json(booking);
		var results =[];
		var promises = [];
	    bookings.map(booking => {
        	promises.push(User.findOne({_id:booking.userId}).exec().then((user) => {
		    	var result = booking.toJSON();
				result['user'] = user.toJSON();
				results.push(result);
			}));
		});
		Promise.all(promises).then(function(result) {
			res.json(results);
		});
	});
};
exports.findBookingByClinicId = function(req,res){
	Booking.find({clinicId:req.body.clinicId}, function(err,bookings) {
		if(err)
			res.send(err);
		//res.json(booking);
		var results =[];
		var promises = [];
	    bookings.map(booking => {
        	promises.push(User.findOne({_id:booking.userId}).exec().then((user) => {
		    	var result = booking.toJSON();
				result['user'] = user.toJSON();
				results.push(result);
			}));
		});
		Promise.all(promises).then(function(result) {
			res.json(results);
		});
	});
};

exports.findBookingByUserIdAndStatus = function(req,res){
	Booking.find({userId:req.body.userId, status:req.body.status}, function(err,bookings) {
		if(err)
			res.send(err);
		
		var results =[];
		var promises = [];
	    bookings.map(booking => {
        	promises.push(Clinic.findOne({_id:booking.clinicId}).exec().then((clinic) => {
		    	var result = booking.toJSON();
				result['clinic'] = clinic.toJSON();
				results.push(result);
			}));
				
				
		});
		Promise.all(promises).then(function(result) {
			res.json(results);
		});
	});
};

exports.findBookingByUserId = function(req,res){
	Booking.find({userId:req.body.userId}, function(err,bookings) {
		if(err)
			res.send(err);
		
		var results =[];
		var promises = [];
	    bookings.map(booking => {
        	promises.push(Clinic.findOne({_id:booking.clinicId}).exec().then((clinic) => {
		    	var result = booking.toJSON();
				result['clinic'] = clinic.toJSON();
				results.push(result);
			}));
				
				
		});
		Promise.all(promises).then(function(result) {
			res.json(results);
		});
		
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


exports.markVisited = function(req, res) {
	Booking.findOneAndUpdate({_id: req.body.bookingId}, {'status':'visited'}, function(err, booking) {
    	if (err)
			return res.send(err);
		res.json({ message: 'Booking mark visited successfully!' });
	});
};

exports.sendNotification = function(req, res) {
	//send whatapp or telegram msg code here
	Booking.findOne({_id:req.body.bookingId}, function(err,booking) {
		if(err)
			res.send(err);
		User.findOne({_id:booking.userId}, function(err,user) {
			if(err)
					res.send(err);
				var toContact = "+65"+user.contact;
				var username = "AC0f15abf92c5e30938d7f8990736f26e6";
				var password = "425ad2653fc524626d6933139cd12ed2";
				
				var bodymsg = "This is from neoBooking. Your queue number is in 5 min. Please proceed to clinic as soon as possible.";
				
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