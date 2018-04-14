'use strict';
var mongoose = require('mongoose'),
	User = mongoose.model('User');

var nodemailer = require('nodemailer');





exports.findUserById = function(req,res){
	User.findOne({_id:req.body.userId}, function(err,user) {
		if(err)
			res.send(err);
		res.json(user);
	});
};

exports.findUserByNric = function(req,res){
	User.findOne({nric:req.body.nric}, function(err,user) {
		if(err)
			res.send(err);
		res.json(user);
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
  User.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, function(err, user) {
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

exports.resetPasswordByID = function(req,res){
	var new_password = makeid();
	User.findOneAndUpdate({_id:req.body.userId},{password:new_password}, function(err,user) {
		if(err)
			res.send(err);
		if(user){
			send_email(new_password,user.email,user.nric);
			res.json(user);
		}else{
			res.json({})
		}
	});
};

exports.resetPasswordByEmail = function(req,res){
	var new_password = makeid();
	User.findOneAndUpdate({email:req.body.email},{password:new_password}, function(err,user) {
		if(err)
			res.send(err);
		if(user){
			send_email(new_password,user.email,user.nric);
			res.json(user);
		}else{
			res.json({})
		}
		
	});
};
//reset password related stuff below
//use your own gmail account.
var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: 'n2ttesttest@gmail.com',
	    pass: 'Password123$'
	  }
	});

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 10; i++)
	text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function send_email(password,recipient,nric){

	var mailOptions = {
	  from: 'no-reply@gmail.com',
	  to: recipient,
	  subject: 'Sending Email using Node.js',
	  html: 'Dear Neobooking User ,<br><br>This is your new password: '+password+'<br>NRIC: '+nric+' <br><br><br>Neobooking Team'
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
}

