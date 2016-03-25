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
var serverConfig = require('./config/server-config')[process.env.NODE_ENV || 'development'];

/* Image Handling Modules */
var upload = require('./config/multer-config'); // multer configuration
var cloudinary = require('cloudinary');
require('./config/cloudinary-config')(cloudinary); // sets cloudinary credentials

/* Logs Directory Check and Configuration */
var logDirectory = __dirname + '/logs';

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory); // ensure logs directory exists
}

var loggerConfig = require('./config/logger-config')(logDirectory);
var accessLogStream = loggerConfig.logger;

/* Route Handlers */
var mainController = require('./controllers/main');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');

/* MongoDB Connection */
mongoose.connect(serverConfig.database, function (err) {
  if (err) { console.log('\n\tconnection to ' + url.parse(serverConfig.database).host + ' failed\n'); }
  else { console.log('\n\tconnection to ' + url.parse(serverConfig.database).host + ' was successful\n'); }
});


var server = express();

/* Express Environment Variables */
server.set('port', serverConfig.port);
server.set('ip', serverConfig.host);

/* Middleware */
server.use(helmet());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(compression());

if (process.env.NODE_ENV === 'production') {
  server.use(morgan('combined', { stream: accessLogStream }));
} else if (process.env.NODE_ENV === 'development') {
  server.use(morgan('dev'));
}

/* API Routes */

var router = express.Router();

router.route('/')
  .get(mainController.api);

router.route('/register')
  .post(mainController.register); // user registration

router.route('/login')
  .post(mainController.login); // user login

/* ENABLE AUTHENTICATION FOR ALL /api/users/ ROUTES */
if (process.env.NODE_ENV === 'production') {
  router.use(authController.checkForAuthentication);
}

router.route('/users/:username')
  .get(userController.getUserInfo); // return user object

router.route('/users/:userid')
  .put(userController.updateUserInfo) // update account information
  .delete(userController.deleteUser); // delete user account permanently

router.route('/users/:userid/location')
  .post(userController.updateUserLocation) // update and store a user's location
  .put(userController.getNearbyUsers); // updates the user location and returns nearby users

router.route('/users/:username/profile')
  .get(userController.getUserProfile) // get a user's profile information
  .put(upload.single('profile_image'), userController.updateUserProfile); // update a user's profile information

server.use('/api', router); // set routes


/* Routes Error Handling */

// catch 404 status code
server.get('*', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).send({ message: 'Not Found' });
});

// development error handler
// will print stacktrace
if (server.get('env') === 'development') {
  server.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
server.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/* Initialize the Server */
server.listen(server.get('port'), server.get('ip'), function () {
  console.log('Server listening at %s:%d', server.get('ip'), server.get('port'));
});

// make the server available for integration tests
module.exports = server;

