var express = require('express');
var router = express.Router();


router.get('/', function(req, res){
  var template_data = {title : 'Neo Booking | Home'}
  res.render('index', template_data);
});




module.exports = router;