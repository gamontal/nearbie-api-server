'use strict';

/* Environment Objects */
var env = {
  production: {
    port: Number(process.env.PORT || 8080),
    host: process.env.IP || '127.0.0.1',
    database: 'mongodb://ds061355.mongolab.com:61355/quickee-db',
    secret: 'rRID4RK7'
  },
  development: {
    port: Number(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080),
    host: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1',
    database: 'mongodb://ds061355.mongolab.com:61355/quickee-db' // after production this URI will point to a local or testing database
  },
  test: {
    port: Number(process.env.PORT || 3000),
    host: '127.0.0.1', // run tests in a local environment only
    database: 'mongodb://ds011369.mlab.com:11369/quickee-test-db'
  }
};

module.exports = function () {
  switch(process.env.NODE_ENV) {
  case 'production': return env.production;    // production environment
  case 'development': return env.development;  // development environment
  case 'test': return env.test;                // test environment
  default: return env.development; // node server will start en development mode by default
  }
};

