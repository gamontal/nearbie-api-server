'use strict';

exports.api = function (req, res) {
  var result = {
    version: require('../package').version
  };

  res.status(200).json(result);
};
