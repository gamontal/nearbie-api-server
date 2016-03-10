module.exports = {
  'development': {
    'port': Number(process.env.PORT || 3000),
    'database': 'mongodb://admin:admin@ds061355.mongolab.com:61355/quickee-db'
  },
  'production': {
    'port': Number(process.env.PORT || 3000),
    'database': 'mongodb://admin:admin@ds061355.mongolab.com:61355/quickee-db',
    'secret': 'rRID4RK7'
  },
  'cloudinary': {
    'cloud_name': 'dvicgeltx',
    'api_key': '841515145465371',
    'api_secret': 'rNQS1l59HRQuN9uCEMzmRWgA4HM'
  }
};

