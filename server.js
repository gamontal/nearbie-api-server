var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');
var controller = require('./controllers/index');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');

mongoose.connect(config.database);
var app = express();

//app.set('env', config.env);
app.use(morgan('dev'));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(passport.initialize());

var router = express.Router();

router.route('/').get(controller.api);
router.route('/register').post(controller.register); // user registration
//router.route('/login').post(controller.login); // user login

/*
router.route('/user/:username')
  .put(userController.user);
  .delete(userController.user);
*/

router.route('/user/profile/:username')
  .get(authController.isAuthenticated, userController.getProfile) // get a user's profile
  //.put(userController.updateProfile); // update user profile

app.use('/api', router); // initialize routes

// catch 404 status code
app.get('*', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).send({ message: 'Not Found' });
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// start the server
app.listen(config.port, function () {
    console.log('Listening on port ' + config.port);
});

