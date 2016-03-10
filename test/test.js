var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var serverConfig = require('../config/server-config');

describe('Routing', function () {
  var url = 'http://quickee-api.herokuapp.com/api';

  before(function (done) {
    mongoose.connect(serverConfig.test.database);
    done();
  });

  describe('Account', function () {
    it('should return error trying to save duplicate username', function (done) {
      var userInfo = {
        username: 'user1',
        password: '1234',
        email: 'user1@server.com'
      };

      request(url)
        .post('/register')
        .send(userInfo)
        .end(function (err, res) {
          if (err) { throw err }

          should(res).have.property('status', 400);
          done();
        });
    });
  })
})
