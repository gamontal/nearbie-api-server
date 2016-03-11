module.exports = {
  'production': {
    'port': Number(process.env.PORT || 3000),
    'database': 'mongodb://admin:admin@ds061355.mongolab.com:61355/quickee-db',
    'secret': 'rRID4RK7'
  },
  'development': {
    'port': Number(process.env.PORT || 3001),
    'database': 'mongodb://admin:admin@ds061355.mongolab.com:61355/quickee-db'
  },
  'test': {
    'port': Number(process.env.PORT || 3002),
    'database': 'mongodb://admin:admin@ds011369.mlab.com:11369/quickee-test-db'
  }
};

