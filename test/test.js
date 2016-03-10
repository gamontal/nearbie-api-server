var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var serverConfig = require('../config/server-config').test;

describe('Routing', function () {
  var url = 'http://quickee-api.herokuapp.com'; // NOTE change to http://quickee-api.herokuapp.com before deployment

  before(function (done) {
    mongoose.connect(serverConfig.database);
    done();
  });

  describe('Account', function () {
    it('should should return error trying to save duplicate username', function (done) {
      var userInfo = {
        username: 'user1',
        password: '1234',
        email: 'user1@server.com'
      };

      request(url)
        .post('/api/register')
        .send(userInfo)
        .end(function (err, res) {
          if (err) { throw err }

          should(res).have.property('status', 400);
          done();
        });
    });
  })
})
