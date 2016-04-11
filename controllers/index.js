'use strict';

exports.api = function (req, res, next) {
  var result = {
    version: require('../package').version
  };

  res.status(200).json(result);
};
