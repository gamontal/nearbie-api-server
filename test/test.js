var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');

var userInfo = {
  _id: '56e20f1d84d6580300e152ba',
  username: 'user1',
  password: '1234',
  email: 'user1@server.com',
  loc: [-66.758605, 18.475206],
  profile: {
    profile_image: 'http://res.cloudinary.com/demo/image/upload/v1371281596/sample.jpg',
    gender: 'Male',
    bio: 'People person'
  }
};

describe('Routing', function () {
  var url = 'http://quickee-api.herokuapp.com/api';

  describe('Account', function () {

    it('should return the API\'s main page', function (done) {
      request(url)
        .get('/')
        .end(function (err, res) {
          try {
            should(res).have.property('status', 200);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should return error trying to save duplicate username or email', function (done) {
      var payload = {
        username: userInfo.username,
        password: userInfo.password,
        email: userInfo.email,
        "loc": [userInfo.loc[0], userInfo.loc[1]]
      };

      request(url)
        .post('/register')
        .send(payload)
        .end(function (err, res) {
          try {
            if (err) { throw err }

            should(res).have.property('status', 400);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should return the user\'s information', function (done) {
      request(url)
        .get('/users/' + userInfo.username)
        .end(function (err, res) {
          try {
            if (err) { throw err }

            should(res).have.property('status', 200);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should update a user\'s account information', function (done) {
      var payload = {
        username: userInfo.username,
        password: userInfo.password,
        email: userInfo.email
      };

      request(url)
        .put('/users/' + userInfo._id)
        .send(payload)
        .end(function (err, res) {
          try {
            if (err) { throw err }

            should(res).have.property('status', 200);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should update a user\'s location', function (done) {
      var payload = {
      lng: userInfo.loc[0],
      lat: userInfo.loc[1]
      };

      request(url)
        .post('/users/' + userInfo._id + '/location')
        .send(payload)
        .end(function (err, res) {
          try {
            if (err) { throw err }

            should(res).have.property('status', 200);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should update a user\'s location and return nearby users', function (done) {
      var payload = {
        lng: userInfo.loc[0],
        lat: userInfo.loc[1]
      };

      request(url)
        .put('/users/' + userInfo._id + '/location')
        .send(payload)
        .end(function (err, res) {
          try {
            if (err) { throw err }

            should(res).have.property('status', 200);
            done();
          } catch (e) {
            done(e);
          }
        });
    });

    it('should return a user\'s profile information', function (done) {
      request(url)
        .get('/users/' + userInfo.username + '/profile')
        .end(function (err, res) {
          try {
            if (err) { throw err }

            should(res).have.property('status', 200);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
/*
    it('should update a user\'s profile information', function (done) {
      var payload = {
          profile_image: userInfo.profile_image,
          gender: userInfo.gender,
          bio: userInfo.bio
      };

      request(url)
        .put('/users/' + userInfo.username + '/profile')
        .send(payload)
        .end(function (err, res) {
          try {
            if (err) { throw err }

            should(res).have.property('status', 200);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
*/
  });
});
