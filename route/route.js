'use strict';
module.exports = function(app){
	var loginController = require('../controllers/loginController');
	var bookingController = require('../controllers/BookingController');
	app.route('/getAllusers')
	.get(loginController.list_all_users);
	
	app.route('/register')
	.post(loginController.registerNewUser);
	
	app.route('/findUserById')
	.post(loginController.findUserById);
		
	app.route('/book')
	.post(bookingController.createNewBooking);
	
	app.route('/findBookingByClinicId')
	.post(bookingController.findBookingByClinicId);
};
