'use strict';
var mongoose = require('mongoose'),
	User = mongoose.model('User');


exports.readUserByEmail = function(req,res){
	User.findById(req.params.email, function(err,user) {
		if(err)
			res.send(err);
		res.jason(user)
	});
};

exports.registerNewUser = function(req,res){
	var new_user = new User(req.body);
	new_user.save(function(err,user) {
		if(err)
			res.send(err);
		res.json(user);
	});
};

exports.list_all_users = function(req, res) {
  User.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.update_userinfo = function(req, res) {
  User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.remove_user = function(req, res) {
  User.remove({
    _id: req.params.userId
  }, function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully removed' });
  });
};