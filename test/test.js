var server = require('../server');
var should = require('should');
var assert = require('assert');
var request = require('supertest');

var testUser = {
  _id: '56e3001a76517d7d05122b1b',
  username: 'user1',
  password: '1234',
  email: 'user1@server.com',
  loc: [-69.758605, 19.475206],
  profile: {
    profile_image: 'http://res.cloudinary.com/demo/image/upload/v1371281596/sample.jpg',
    gender: 'Male',
    bio: 'People person'
  }
};

describe('Routing', function () {
  var url = server;

  describe('API', function () {
    it('should return the API\'s main page', function (done) {
      request(url)
        .get('/api')
        .end(function (err, res) {
          try {
            should(res).have.property('status', 200);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('Account', function () {
    it('should return error trying to save duplicate username or email', function (done) {
      var payload = {
        username: testUser.username,
        password: testUser.password,
        email: testUser.email,
        "loc": [testUser.loc[0], testUser.loc[1]]
      };

      request(url)
        .post('/api/register')
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
        .get('/api/users/' + testUser.username)
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
        username: testUser.username,
        password: testUser.password,
        email: testUser.email
      };

      request(url)
        .put('/api/users/' + testUser._id)
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
      lng: testUser.loc[0],
      lat: testUser.loc[1]
      };

      request(url)
        .post('/api/users/' + testUser._id + '/location')
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
        lng: testUser.loc[0],
        lat: testUser.loc[1]
      };

      request(url)
        .put('/api/users/' + testUser._id + '/location')
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
        .get('/api/users/' + testUser.username + '/profile')
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
          profile_image: testUser.profile_image,
          gender: testUser.gender,
          bio: testUser.bio
      };

      request(url)
        .put('/users/' + testUser.username + '/profile')
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
