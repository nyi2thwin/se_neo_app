var express = require('express');
var router = express.Router();


//get request
router.get('/', function(req, res){
  var template_data = {title : 'Neo Booking | Account'}
  res.send(template_data);
});

//post request
router.post('/', function(req, res){
  var template_data = {title : 'Neo Booking | Account'}
  res.send(template_data);
});



module.exports = router;