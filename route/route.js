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
	
	app.route('/findUserByNric')
	.post(accountController.findUserByNric);
		
	app.route('/updateUser')
	.post(accountController.update_userinfo);
	
	app.route('/createBooking')
	.post(bookingController.createNewBooking);
	
	app.route('/findBookingByUserIdAndStatus')
	.post(bookingController.findBookingByUserIdAndStatus);
	
	app.route('/findBookingByClinicId')
	.post(bookingController.findBookingByClinicId);
	
	app.route('/findBookingByUserId')
	.post(bookingController.findBookingByUserId);
	
	app.route('/deleteBooking')
	.post(bookingController.deleteBooking);

	app.route('/sendNotification')
	.post(bookingController.sendNotification);

	app.route('/markVisited')
	.post(bookingController.markVisited);

	app.route('/resetPasswordByID')
	.post(accountController.resetPasswordByID);

	app.route('/resetPasswordByEmail')
	.post(accountController.resetPasswordByEmail);
	
};
