// builtin
var fs = require('fs');
var path = require('path');
var assert = require('assert');

// 3rd party
var express = require('express');
var request = require('request');
var mongoose = require('mongoose');

// local
var hbs = require('hbs').create();
var app = express();
var User = require('./models/User');
var Clinic = require('./models/Clinic');
var Booking = require('./models/Booking');
var bodyParser = require('body-parser');
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyD2Nza2P2FZmM0ZY7lRf1-kYX_h-ONgPuI', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
 
geocoder = NodeGeocoder(options);

//mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/neobooking');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// render html files using hbs as well
// tests detecting the view engine extension
app.engine('html', hbs.__express);

// set the view engine to use handlebars
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/templates/layouts');

// expose app and response locals in views
hbs.localsAsTemplateData(app);
app.locals.father = 'NA';

var routes = require('./route/route'); //importing route
routes(app); //register the route

var clinic_routes = require('./route/clinic_route'); //importing route
clinic_routes(app); //register the route



//register view 
app.use('/', require('./views/userView'));


app.use(function(err, req, res, next) {
  res.status(500).send(err.stack.toString());
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
