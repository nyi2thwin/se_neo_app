'use strict';
module.exports = function(app){
	var clinicController = require('../controllers/clinicController');
	
	app.route('/getAllclinics')
	.get(clinicController.list_all_clinics);
	
	app.route('/findClinicById')
	.post(clinicController.findClinicById);

	app.route('/registerClinic')
	.post(clinicController.registerNewClinic);
};
