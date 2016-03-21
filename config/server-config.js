module.exports = {
  'production': {
    'port': Number(process.env.PORT || 3000),
    'host': process.env.IP || '127.0.0.1',
    'database': 'mongodb://admin:admin@ds061355.mongolab.com:61355/quickee-db',
    'secret': 'rRID4RK7'
  },
  'development': {
    'port': Number(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3001),
    'host': process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1',
    'database': 'mongodb://admin:admin@ds061355.mongolab.com:61355/quickee-db'
  },
  'test': {
    'port': Number(process.env.PORT || 3002),
    'host': '127.0.0.1',
    'database': 'mongodb://admin:admin@ds011369.mlab.com:11369/quickee-test-db'
  }
};

