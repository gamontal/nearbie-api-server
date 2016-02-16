var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var config = require('./config');
var controller = require('./controllers/index');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var server = express();

mongoose.connect(config.database, function (err) {
  if (err) { console.log(err); }
  else { console.log('connection to [' + config.database + '] was successful'); } // these logs are intended for development
});

server.use(morgan('dev'));
server.use(methodOverride());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.set('rRID4RK7', config.secret); // sets API token

var router = express.Router();

router.route('/')
  .get(controller.api);

router.route('/register')
  .post(controller.register); // user registration

router.route('/login')
  .post(controller.login); // user login

// router.route('/logout')
  // .post(controller.logout); // user logout

/* ENABLE AUTHENTICATION */
router.use(authController.checkForAuthentication);

router.route('/user/:username')
  .get(userController.getUserInfo); // return user object

router.route('/user/:userId')
  .delete(userController.deleteUser); // delete user account permanently
  .put(userController.updateUserInfo); // update account information

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

