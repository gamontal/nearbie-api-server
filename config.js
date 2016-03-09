module.exports = {
  'development': {
    'port': 3000,
    'database': 'mongodb://localhost:27017/quickeedb'
  },
  'production': {
    'port': Number(process.env.PORT || 3000),
    'database': 'mongodb://admin:admin@ds061355.mongolab.com:61355/quickee-db',
    'secret': 'rRID4RK7'
  }
};

