'use strict';
module.exports = function(app){
	var clinicController = require('../controllers/clinicController');
	
	app.route('/getAllclinics')
	.get(clinicController.listAllClinics);
	
	app.route('/findClinicById')
	.post(clinicController.findClinicById);

	app.route('/deleteClinicById')
	.post(clinicController.deleteClinic);

	app.route('/registerClinic')
	.post(clinicController.registerNewClinic);
	
	app.route('/updateClinic')
	.post(clinicController.editClinic);

	app.route('/getNearByClinic/:postalcode')
	.get(clinicController.listNearbyClinic);

	app.route('/addReview')
	.post(clinicController.addReview);

	app.route('/deleteReview/:reviewId')
	.post(clinicController.deleteReview);

	app.route('/editReview/:reviewId')
	.post(clinicController.editReview);
};
