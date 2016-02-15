var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
// var cookieParser = require('cookie-parser');
var config = require('./config');
var controller = require('./controllers/index');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');

mongoose.connect(config.database, function (err) {
  if (err) { console.log(err); }
  else { console.log('connection to [' + config.database + '] was successful'); } // these logs are intended for development
});

var server = express();

server.set('env', config.env);
server.use(morgan('dev'));
server.use(bodyParser.json({ type: 'application/json' }));
// server.use(cookieParser());
server.use(methodOverride());
server.use(passport.initialize());

var router = express.Router();

router.route('/').get(controller.api);
router.route('/register').post(controller.register); // user registration
router.route('/login').post(authController.loginAuth, controller.login); // user login

router.route('/user/:userId')
 // .put(authController.isAuthenticated, userController.updateUserInfo); // update account information
  .delete(userController.deleteUser); // delete user account permanently

router.route('/user/profile/:username')
  .get(userController.getProfile) // get a user's profile information
  .put(userController.updateProfile); // update a user's profile information

server.use('/api', router); // initialize routes

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

