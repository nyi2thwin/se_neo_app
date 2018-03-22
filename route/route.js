'use strict';
module.exports = function(app){
	var loginController = require('../controllers/loginController');
	
	app.route('/login/:email')
	.get(loginController.readUserByEmail);
	
	app.route('/users')
	.get(loginController.list_all_users)
	.post(loginController.registerNewUser);
};