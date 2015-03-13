'use strict';

let User = require('../../models/user');
let Joi = require('joi');

module.exports = {
  validate: {
    params: {
      userId: Joi.string().required()
    },
    payload: {
      displayName: Joi.string().required(),
      photoUrl: Joi.string().required(),
      phone: Joi.string().required()
    }
  },
  handler: function(request, reply){
    User.findOneAndUpdate({_id:request.params.userId}, request.payload, (err, user)=>{
      reply(user);
    });
  }
};
