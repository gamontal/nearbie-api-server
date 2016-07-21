'use strict';

var fs = require('fs');
var url = require('url');
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var compression = require('compression');
var helmet = require('helmet');
var bodyParser = require('body-parser');

/* Server Configuration */
var ServerConfiguration = require('./config/server-config');
var serverConfig = ServerConfiguration();

/* Image Handling Modules */
var upload = require('./config/multer-config'); // multer configuration
var cloudinary = require('cloudinary');
require('./config/cloudinary-config')(cloudinary); // sets cloudinary credentials

/* Logs Directory Check and Configuration */
var logDirectory = __dirname + '/logs';

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory); // ensure logs directory exists
}

var logConfig = require('./config/logger-config');
var logStream = logConfig.stream;

/* API Controllers */
var authController = require('./controllers/auth');
var indexController = require('./controllers/index');
var registrationController = require('./controllers/registration');
var loginController = require('./controllers/login');
var placeController = require('./controllers/place');
var eventController = require('./controllers/event');
var userController = require('./controllers/user');

/* Database Connection */
var dbConfig = require('./config/database-config');

mongoose.connect(serverConfig.database, dbConfig, function (err) {
  if (err) { console.error('\nconnection to ' +
                         url.parse(serverConfig.database).host + ' failed\n'); }
  else { console.log('\nconnection to ' +
                     url.parse(serverConfig.database).host + ' was successful\n'); }
});

var server = express();

/* Express Environment Variables */
server.set('config', serverConfig);
server.set('port', serverConfig.port);
server.set('ip', serverConfig.host);

/* Application-wide Middleware */
server.use(bodyParser.urlencoded({
  limit: '100kb',
  extended: false,
  parameterLimit: 1000
}));

server.use(bodyParser.json({
  limit: '100kb'
}));

if (process.env.NODE_ENV === 'production') {
  server.use(morgan('combined', { stream: logStream }));

  // Security headers are handled by the reverse proxy server (NGINX) in production
} else {
  server.use(helmet()); // adds security headers using express

  // gzip compression for data transit
  // NOTE: DO NOT USE WITH TLS TRANSPORTS, SEE: https://en.wikipedia.org/wiki/CRIME
  server.use(compression());

  server.use(morgan('dev')); // developer friendly console logger
}

/* API Routes */

var router = express.Router();

router.route('/')
  .get(indexController.api);

router.route('/register')
  .post(registrationController.register); // user registration

router.route('/authenticate')
  .post(loginController.authenticate); // user login

/* ENABLE AUTHENTICATION FOR ALL /api/users/ ROUTES */
if (process.env.NODE_ENV === 'production') {
  router.use(authController.checkForAuthentication);
}

router.route('/users/:username')
  .get(userController.getUser); // return user object

router.route('/users/:user_id')
  .put(userController.updateUser) // update account information
  .delete(userController.deleteUser); // delete user account permanently

router.route('/users/:user_id/location')
  .post(userController.updateUserLocation) // update and store a user's location
  .put(userController.getNearbyUsers); // updates the user location and returns nearby users

router.route('/users/:username/profile')
  .put(upload.single('profile_image'), userController.updateUserProfile); // update a user's profile information

router.route('/users/:user_id/blocks')
  .post(userController.blockUser) // blocks a specified user
  .delete(userController.removeBlockedUsers);

router.route('/events')
  .get(eventController.getEvents); // get all registered events

router.route('/events/:event_id')
  .get(eventController.getEvent); // get information about a event

router.route('/places/:user_id')
  .put(placeController.getNearbyPlaces); // get all registered nearby places

router.route('/places/:place_id')
  .get(placeController.getPlace); // get information about a place

server.use('/api', router); // set routes


/* Routes Error Handling */

// catch 404 status code
server.get('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
  server.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
server.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/* Initialize the Server */
server.listen(server.get('port'), server.get('ip'), function () {
  console.log('\nListening for client connections on %s:%d', server.get('ip'), server.get('port'));
});

// make the server available for integration tests
module.exports = server;

