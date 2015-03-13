/* jshint camelcase:false */

'use strict';

let mongoose = require('mongoose');
let req = require('request');
let qs = require('querystring');
let moment = require('moment');
let stripe = require('stripe')(process.env.STRIPE_SECRET);
let Vacation;

let vacationSchema = mongoose.Schema({
  departureAirport: {type: String, required: true},
  arrivalAirport: {type: String, required: true},
  departureDate: {type: Date, required: true},
  returnDate: {type: Date, required: true},
  title: {type: String, required: true},
  userId: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  createdAt: {type: Date, default: Date.now, required: true},
  flight:{
    charge:{
      id: String,
      amount: Number,
      date: Date
    },
    itinerary:{
      leaving:[
        {
          departure: String,
          arrival: String,
          duration: Number,
          flight: String,
          airline: String
        }
      ],
      returning:[
        {
          departure: String,
          arrival: String,
          duration: Number,
          flight: String,
          airline: String
        }
      ]
    }
  }
});

vacationSchema.methods.itinerary = function(o){
  this.flight.itinerary.leaving = parseItinerary(0, o);
  this.flight.itinerary.returning = parseItinerary(1, o);
};

function parseItinerary(index, o){
  return o.itinerary.OriginDestinationOptions.OriginDestinationOption[index].FlightSegment.map(s=>{
    return {
      departure: s.DepartureAirport.LocationCode,
      arrival: s.ArrivalAirport.LocationCode,
      duration: s.ElapsedTime,
      flight: s.OperatingAirline.FlightNumber,
      airline: s.OperatingAirline.Code
    };
  });
}

vacationSchema.methods.purchase = function(o, cb){
  stripe.charges.create({
    amount: Math.ceil(o.cost),
    currency: 'usd',
    source: o.token,
    description: o.description
  }, (err, charge)=>{
    if(!err){
      this.flight.charge.id = charge.id;
      this.flight.charge.amount = charge.amount / 100;
      this.flight.charge.date = new Date();
    }

    cb(err, charge);
  });
};

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
