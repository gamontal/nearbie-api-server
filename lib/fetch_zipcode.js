'use strict';

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var xmlHttp;

const fetchZipcode = function (coords) {
  const lat = coords[1] || null;
  const lng = coords[0] || null;

  const httpGet = function (url) {
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false);
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
  };

  const reqUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=false';
  const data = httpGet(reqUrl);

  if (data.results === []) {
    return {
      status: 'ZERO_RESULTS'
    };
  } else {
    const addressComponents = data.results[0].address_components;
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

