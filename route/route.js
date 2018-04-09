'use strict';
module.exports = function(app){
	var accountController = require('../controllers/AccountController');
	var bookingController = require('../controllers/BookingController');
	app.route('/getAllusers')
	.get(accountController.list_all_users);
	
	app.route('/register')
	.post(accountController.registerNewUser);
	
	app.route('/findUserById')
	.post(accountController.findUserById);
		
	app.route('/updateUser')
	.post(accountController.update_userinfo);
	
	app.route('/book')
	.post(bookingController.createNewBooking);
	
	app.route('/findBookingByClinicId')
	.post(bookingController.findBookingByClinicId);

	
	app.route('/deleteBooking')
	.post(bookingController.deleteBooking);

	app.route('/sendNotification')
	.post(bookingController.sendNotification);
};
