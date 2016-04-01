'use strict';

var local = require('../server');
var should = require('should');
// var assert = require('assert');
var request = require('supertest');

var testUser = {
  _id: '56e3001a76517d7d05122b1b',
  username: 'user1',
  password: '1234',
  email: 'user1@server.com',
  loc: [-69.758605, 19.475206],
  profile: {
    profile_image: undefined,
    gender: 'Male',
    bio: 'People person'
  }
};

var server_test = function (server) {
  describe('Routing', function () {
    var url = server;

    describe('API connection', function () {
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
      it('should RETURN ERROR trying to save duplicate username or email', function (done) {
        var payload = {
          username: testUser.username,
          password: testUser.password,
          email: testUser.email,
          "loc": [testUser.loc[0], testUser.loc[1]]
      };

      request(url)
          .post('/api/register')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 400);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should RETURN ERROR if the user doesn\'t exist #1', function (done) {
        request(url)
          .get('/api/users/user')
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 404);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should RETURN ERROR if the user doesn\'t exist #2', function (done) {
        var payload = {
          username: testUser.username,
          password: testUser.password,
          email: testUser.email
        };

        request(url)
        .put('/api/users/56e3001a76517d7d05122123')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 404);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should RETURN ERROR if the user doesn\'t exist #3', function (done) {
        var payload = {
          bio: testUser.profile.bio,
          gender: testUser.profile.gender
        };

        request(url)
          .put('/api/users/user/profile')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 404);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should RETURN ERROR if the user doesn\'t exist #4', function (done) {
        var payload = {
          lng: testUser.loc[0],
          lat: testUser.loc[1]
        };

        request(url)
          .post('/api/users/56e3001a76517d7d05122123/location')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 404);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should RETURN ERROR if an invalid user ID is used #1', function (done) {
        var payload = {
          username: testUser.username,
          password: testUser.password,
          email: testUser.email
        };

        request(url)
          .put('/api/users/56e3001a76517d7d05')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 400);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should RETURN ERROR if an invalid user ID is used #2', function (done) {
        var payload = {
          lng: testUser.loc[0],
          lat: testUser.loc[1]
        };

        request(url)
          .put('/api/users/56e3001a76517d7d05/location')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 400);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should RETURN the user\'s information', function (done) {
        request(url)
          .get('/api/users/' + testUser.username)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 200);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should UPDATE a user\'s account information #1', function (done) {
        var payload = {
          username: testUser.username
        };

        request(url)
          .put('/api/users/' + testUser._id)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 200);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should UPDATE a user\'s account information #2', function (done) {
        var payload = {
          password: testUser.password
        };

        request(url)
          .put('/api/users/' + testUser._id)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 200);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should UPDATE a user\'s account information #3', function (done) {
        var payload = {
          email: testUser.email
        };

        request(url)
          .put('/api/users/' + testUser._id)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 200);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should UPDATE a user\'s account information #4', function (done) {
        var payload = {
          username: testUser.username,
          password: testUser.password,
          email: testUser.email
        };

        request(url)
          .put('/api/users/' + testUser._id)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 200);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should UPDATE a user\'s location', function (done) {
        var payload = {
          lng: testUser.loc[0],
          lat: testUser.loc[1]
        };

        request(url)
          .post('/api/users/' + testUser._id + '/location')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 200);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should UPDATE a user\'s location and return nearby users', function (done) {
        var payload = {
          lng: testUser.loc[0],
          lat: testUser.loc[1]
        };

        request(url)
          .put('/api/users/' + testUser._id + '/location')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 200);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should RETURN a user\'s profile information', function (done) {
        request(url)
          .get('/api/users/' + testUser.username + '/profile')
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 200);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should UPDATE a user\'s profile information #1', function (done) {
        var payload = {
          gender: testUser.profile.gender
        };

        request(url)
          .put('/api/users/' + testUser.username + '/profile')
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 200);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should UPDATE a user\'s profile information #2', function (done) {
        var payload = {
          bio: testUser.profile.bio
        };

        request(url)
          .put('/api/users/' + testUser.username + '/profile')
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 200);
              done();
            } catch (e) {
              done(e);
            }
          });
      });

      it('should UPDATE a user\'s profile information #3', function (done) {
        var payload = {
          profile_image: testUser.profile.profile_image
        };

        request(url)
          .put('/api/users/' + testUser.username + '/profile')
          .send(payload)
          .end(function (err, res) {
            try {
              if (err) { throw err; }

              should(res).have.property('status', 200);
              done();
            } catch (e) {
              done(e);
            }
          });
      });
    });
  });
};

console.log('\nTesting local server.....');
server_test(local);

/*
console.log('Testing remote (development) server.....');
server_test('https://qserv-binarybeats.rhcloud.com');
*/
