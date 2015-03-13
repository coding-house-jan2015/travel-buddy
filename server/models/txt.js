'use strict';

let client = require('twilio')(process.env.TWILIO_PUBLIC, process.env.TWILIO_SECRET);

class Txt {
  static send(to, body, cb){
    client.messages.create({
      body: body,
      to: to,
      from: '+19177461483'
    }, cb);
  }
}

module.exports = Txt;
