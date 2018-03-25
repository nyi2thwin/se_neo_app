'use strict';
module.exports = function(app){
	var loginController = require('../controllers/loginController');
	
	app.route('/getAllusers')
	.get(loginController.list_all_users);
	
	app.route('/register')
	.post(loginController.registerNewUser);
	
	app.route('/findUserById')
	.post(loginController.findUserById);
};
