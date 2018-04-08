'use strict';
var mongoose = require('mongoose'),
	Clinic = mongoose.model('Clinic'),
	Review = mongoose.model('Review');


exports.findClinicById = function(req,res){
	Clinic.findOne({_id:req.body.clinicId}, function(err,clinic) {
		if(err)
			return res.send(err);
		Review.find({_clinicId:req.body.clinicId}, function(err,reviews){
			if(err)
				return res.send(err);
			var result = clinic.toJSON();
			result['reviews'] = reviews;
			res.send(result);
		});
		
	});
};

exports.registerNewClinic = function(req,res){
	var new_clinic = new Clinic(req.body);
	new_clinic.save(function(err,user) {
		if(err)
			return res.send(err);
		res.json(user);
	});
};

exports.listAllClinics = function(req, res) {

  	Clinic.find({}, function(err, Clinics) {
	 var jobQueries = [];
		if (err)
			return res.send(err);
		res.json(Clinics);
  });
};

exports.listNearbyClinic = function(req, res) {
	
	geocoder.geocode(req.params.postalcode+ " Singapore", function(err, result) {
	  	if (err)
			return res.send(err);
		Clinic.find( { location : { $near : [result[0]['latitude'],result[0]['longitude']] } } ).limit(5).exec(function(err, results) {
   			if(err)
				return res.send(err);
			res.json(results);
		});
	});
	
};

exports.deleteClinic = function(req, res) {
	Clinic.remove({
	    _id: req.body.clinicId
	}, function(err, clinic) {
	    if (err)
	    	return res.send(err);
	    res.json({ message: 'Clinic successfully removed' });
	});
};

exports.editClinic = function(req, res) {
	Clinic.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, function(err, clinic) {
    	if (err)
			return res.send(err);
		res.json(clinic);
	});
};

//review releated stuff
exports.addReview = function(req, res) {
	var new_review = new Review(req.body);
	new_review.save(function(err,review) {
		if(err)
			return res.send(err);
		res.json(review);
	});
};

exports.deleteReview = function(req, res) {
	Review.remove({
	    _id: req.params.reviewId
	}, function(err, review) {
	    if (err)
	    	return res.send(err);
	    res.json({ message: 'User successfully removed' });
	});
};

exports.editReview = function(req, res) {
	Review.findOneAndUpdate({_id: req.params.reviewId}, req.body, {new: true}, function(err, review) {
    	if (err)
			return res.send(err);
		res.json(review);
	});
};

	


