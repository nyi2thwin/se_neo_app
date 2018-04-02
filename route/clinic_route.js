'use strict';
module.exports = function(app){
	var clinicController = require('../controllers/clinicController');
	
	app.route('/getAllclinics')
	.get(clinicController.listAllClinics);
	
	app.route('/findClinicById')
	.post(clinicController.findClinicById);

	app.route('/registerClinic')
	.post(clinicController.registerNewClinic);

	app.route('/getNearByClinic/:postalcode')
	.get(clinicController.listNearbyClinic);
};
