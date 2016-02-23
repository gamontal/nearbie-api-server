var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');
var server = express();

/* Route Handlers */
var mainController = require('./controllers/main');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');

/* MongoDB Connection */
mongoose.connect(config.database, function (err) {
  if (err) { console.log(err); }
  else { console.log('connection to [' + config.database + '] was successful'); } // this output will be removed once in production
});

/* Middleware */
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());


/* API Routes */

var router = express.Router();

router.route('/')
  .get(mainController.api);

router.route('/register')
  .post(mainController.register); // user registration

router.route('/login')
  .post(mainController.login); // user login

/* ENABLE AUTHENTICATION FOR ALL /api/users/ ROUTES */
//router.use(authController.checkForAuthentication);

router.route('/users/:username')
  .get(userController.getUserInfo); // return user object

router.route('/users/:userid')
  .put(userController.updateUserInfo) // update account information
  .delete(userController.deleteUser); // delete user account permanently

router.route('/users/location/:userid')
  .put(userController.updateUserLocation); // updates the user location and returns nearby users

router.route('/users/profile/:username')
  .get(userController.getProfile) // get a user's profile information
  .put(userController.updateProfile); // update a user's profile information


server.use('/api', router); // initialize routes


/* Server Configuration */

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

// start the server
server.listen(config.port, function () {
    console.log('Listening on port ' + config.port);
});

