'use strict';
var mongoose = require('mongoose'),
	Clinic = mongoose.model('Clinic');


exports.findClinicById = function(req,res){
	Clinic.findOne({userId:req.body.clinicId}, function(err,user) {
		if(err)
			res.send(err);
		res.json(user);
	});
};

exports.registerNewClinic = function(req,res){
	var new_clinic = new Clinic(req.body);
	new_clinic.save(function(err,user) {
		if(err)
			res.send(err);
		res.json(user);
	});
};

exports.listAllClinics = function(req, res) {

  	Clinic.find({}, function(err, Clinics) {
	if (err)
		res.send(err);

	Clinics.forEach(function(c) {
		c.l
		jobQueries.push(jobSchema.find({u_sno:s.u.sno}));
	 });
    res.json(Clinics);
  });
};

exports.listNearbyClinic = function(req, res) {
	//res.body.postalcode

	console.log(req.params.postalcode);
	geocoder.geocode(req.params.postalcode, function(err, result) {
	  	if (err)
			res.send(err);
		console.log(result[0]['latitude'],result[0]['longitude']);
		Clinic.find( { location : { $near : [result[0]['latitude'],result[0]['longitude']] } } ).limit(5).exec(function(err, results) {
   			if(err)
				res.send(err);
			res.json(results);
		});
	});
	
};


	


