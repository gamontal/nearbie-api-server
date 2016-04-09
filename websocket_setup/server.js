'use strict';

var express = require('express');
var mongoose = require('mongoose');
var io = require('socket.io');
var serverConfig = require('./config/server-config');
var server = express();

/* Server Configuration */
var ServerConfiguration = require('./config/server-config');
var serverConfig = new ServerConfiguration();

/* Database connection */
mongoose.connect(serverConfig.database, function (err) {
  if (err) { console.log(err); }
});

/* Controllers */
var eventController = require('./controllers/events');

var router = express.Router();

router.route('/socket/events')
  .get(eventController.updateUserCount);

server.use('/api', router); // set routes

/* Initialize the Server */
server.listen(serverConfig.port, function () {
  console.log('\nServer listening at %s', serverConfig.port);
});
