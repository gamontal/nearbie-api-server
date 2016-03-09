var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var server = express();
var config = require('./config')[server.get('env')];
// var accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'});

/* Route Handlers */
var mainController = require('./controllers/main');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');

/* MongoDB Connection */
mongoose.connect(config.database, function (err) {
  if (err) { console.error(err); } else { console.log(config.database); }
});

/* Middleware */
server.use(morgan('combined'));
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

router.route('/users/:userid/location')
  .post(userController.updateUserLocation) // update and store a user's location
  .put(userController.getNearbyUsers); // updates the user location and returns nearby users

router.route('/users/:username/profile')
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

