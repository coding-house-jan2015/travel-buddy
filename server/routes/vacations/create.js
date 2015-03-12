'use strict';

let Vacation = require('../../models/vacation');
let Joi = require('joi');

module.exports = {
  validate: {
    payload: {
      departureAirport: Joi.string().length(3),
      arrivalAirport: Joi.string().length(3),
      departureDate: Joi.date().required(),
      returnDate: Joi.date().required(),
      title: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    request.payload.userId = request.auth.credentials._id;
    let v = new Vacation(request.payload);
    v.save(err=>{
      reply({vacation:v}).code(err ? 400 : 200);
    });
  }
};
