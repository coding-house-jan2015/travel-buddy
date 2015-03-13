'use strict';

let Vacation = require('../../models/vacation');
let Txt = require('../../models/txt');

module.exports = {
  handler: function(request, reply) {
    Vacation.findById(request.params.vacationId, (err, vaca)=>{
      vaca.purchase(request.payload, (err)=>{
        if(err){return reply().code(400);}

        vaca.itinerary(request.payload);
        Txt.send(request.auth.credentials.phone, `Success! Your CC was charged $${vaca.flight.charge.amount.toFixed(2)}.`, ()=>{
          vaca.save(()=>{
            reply(vaca);
          });
        });
      });
    });
  }
};
