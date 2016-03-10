module.exports = {
  'development': {
    'port': 3000,
    'database': 'mongodb://admin:admin@ds061355.mongolab.com:61355/quickee-db'
  },
  'production': {
    'port': Number(process.env.PORT || 3000),
    'database': 'mongodb://admin:admin@ds061355.mongolab.com:61355/quickee-db',
    'secret': 'rRID4RK7'
  }
};

