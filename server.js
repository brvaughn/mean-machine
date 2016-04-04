// Base Setup
// ============

var config = require('./config');

// Call the packages
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var path        = require('path');

// Token!
var jwt = require('jsonwebtoken');

// pull in the user model
var User        = require('./app/models/user');

// connect to the mongo db instance
mongoose.connect(config.database);

// App Config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

//log all of the stuff
app.use(morgan('dev'));

// Need something for static files
app.use(express.static(__dirname + '/public'));

//ROUTES!
//========

// API ROUTES ------------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


// // more routes!
//
// // api endpoint to get the logged in user's information
// apiRouter.get('/me', function(req, res) {
//   res.send(req.decoded);
// })


// Start me up!

app.listen(config.port);
console.log('Things are all started on port ' + config.port);
