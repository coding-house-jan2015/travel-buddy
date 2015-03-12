/* jshint camelcase:false */

'use strict';

let mongoose = require('mongoose');
let req = require('request');
let qs = require('querystring');
let moment = require('moment');
let Vacation;

let vacationSchema = mongoose.Schema({
  departureAirport: {type: String, required: true},
  arrivalAirport: {type: String, required: true},
  departureDate: {type: Date, required: true},
  returnDate: {type: Date, required: true},
  title: {type: String, required: true},
  userId: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  createdAt: {type: Date, default: Date.now, required: true}
});

vacationSchema.methods.flights = function(cb){
  let self = this;

  let options = {
    method: 'POST',
    url: 'https://api.test.sabre.com/v1/auth/token',
    headers: {
      'Authorization': 'Basic ' + process.env.SABRE_KEY,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  };

  req(options, function(err, response, body){
    let query = {origin:self.departureAirport, destination:self.arrivalAirport, departuredate:moment(self.departureDate).format('YYYY-MM-DD'), returndate:moment(self.returnDate).format('YYYY-MM-DD')};
    let options = {
      method: 'GET',
      url: 'https://api.test.sabre.com/v1/shop/flights?' + qs.stringify(query),
      headers: {'Authorization': 'Bearer ' + JSON.parse(body).access_token}
    };

    req(options, function(err, response, body){
      body = JSON.parse(body);
      cb(null, body);
    });
  });
};

Vacation = mongoose.model('Vacation', vacationSchema);
module.exports = Vacation;
