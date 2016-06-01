'use strict';

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var xmlHttp;

var fetchZipcode = function (coords) {
  var lat = coords[1] || null;
  var lng = coords[0] || null;

  var httpGet = function (url) {
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false);
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
  };

  var reqUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=false';
  var data = httpGet(reqUrl);

  if (data.results === []) {
    return {
      status: 'ZERO_RESULTS'
    };
  } else {
    var addressComponents = data.results[0].address_components;
    var zipcode;

    for (var key in addressComponents) {
      if ((addressComponents[key].types[0] === 'postal_code') || (addressComponents[key].types[0] === 'postal_code_prefix')) {
        zipcode = addressComponents[key].long_name;
        break;
      }
    }

    return zipcode;
  }
};

module.exports = fetchZipcode;

