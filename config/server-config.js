'use strict';

var PKEY;

// check if private key exists
try { PKEY = require('../secret')(); }
catch (ex) { PKEY = undefined; }

/* Environment Objects */
var config = {
  production: {
    port: Number(process.env.PORT || 8080),
    host: process.env.IP || '127.0.0.1',
    database: 'mongodb://ds061355.mongolab.com:61355/quickee-db',
    env: 'prod',
    secret: PKEY
  },
  development: {
    port: Number(process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080),
    host: process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    database: 'mongodb://ds061355.mongolab.com:61355/quickee-db',
    env: 'dev'
  },
  local: {
    port: Number(process.env.PORT || 8080),
    host: '127.0.0.1',
    database: 'mongodb://ds061355.mongolab.com:61355/quickee-db',
    env: 'local'
  },
  test: {
    port: Number(process.env.PORT || 8082),
    host: '127.0.0.1', // run tests in a local environment only
    database: 'mongodb://ds011369.mlab.com:11369/quickee-test-db',
    env: 'test'
  }
};

module.exports = function () {
  switch(process.env.NODE_ENV) {
  case 'production': return config.production;    // production environment
  case 'development': return config.development;  // development environment
  case 'local': return config.local;
  case 'test': return config.test;                // test environment
  default: return config.development;             // node server will start en development mode by default
  }
};

