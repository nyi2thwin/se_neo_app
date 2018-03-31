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

exports.list_all_clinics = function(req, res) {
  Clinic.find({}, function(err, Clinic) {
    if (err)
      res.send(err);
    res.json(Clinic);
  });
};



