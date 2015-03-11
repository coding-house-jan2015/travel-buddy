'use strict';

let mongoose = require('mongoose');
let Vacation;

let vacationSchema = mongoose.Schema({
  departureAirport: {type: String, required: true},
  arrivalAirport: {type: String, required: true},
  departureDate: {type: Date, required: true},
  arrivalDate: {type: Date, required: true},
  title: {type: String, required: true},
  userId: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  createdAt: {type: Date, default: Date.now, required: true}
});

Vacation = mongoose.model('Vacation', vacationSchema);
module.exports = Vacation;
