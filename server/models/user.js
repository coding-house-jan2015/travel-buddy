/* jshint camelcase:false */

'use strict';

let bcrypt = require('bcrypt');
let mongoose = require('mongoose');
let Request = require('request');
let qs = require('querystring');
let jwt = require('jwt-simple');
let moment = require('moment');
let User;

let userSchema = mongoose.Schema({
  email: {type: String, lowercase: true},
  password: {type: String, select: false},
  displayName: String,
  photoUrl: String,
  github: String,
  twitter: String,
  phone: String,
  createdAt: {type: Date, default: Date.now, required: true}
});

userSchema.statics.preTwitter = function(cb){
  let requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  let authenticateUrl = 'https://api.twitter.com/oauth/authenticate';
  let requestTokenOauth = {
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    callback: 'http://127.0.0.1:3333/auth/twitter'
  };

    Request.post({url:requestTokenUrl, oauth:requestTokenOauth}, (err, response, body)=>{
      let oauthToken = qs.parse(body);
      let params = qs.stringify({oauth_token:oauthToken.oauth_token});
      cb(authenticateUrl + '?' + params);
    });
};

userSchema.statics.twitter = function(query, cb){
  let accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  let accessTokenOauth = {
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    token: query.oauth_token,
    verifier: query.oauth_verifier
  };

  Request.post({url:accessTokenUrl, oauth:accessTokenOauth}, (err, response, profile)=>{
    profile = qs.parse(profile);
    cb({twitter:profile.user_id, displayName:profile.screen_name});
  });
};

userSchema.statics.github = function(payload, cb){
  let accessTokenUrl = 'https://github.com/login/oauth/access_token';
  let userApiUrl = 'https://api.github.com/user';
  let params = {
    code: payload.code,
    client_id: payload.clientId,
    redirect_uri: payload.redirectUri,
    client_secret: process.env.GITHUB_SECRET
  };

  Request.get({url:accessTokenUrl, qs:params}, (err, response, accessToken)=>{
    let headers = {'User-Agent':'Satellizer'};
    accessToken = qs.parse(accessToken);
    Request.get({url:userApiUrl, qs:accessToken, headers:headers, json:true}, (err, response, profile)=>{
      cb({github:profile.id, displayName:profile.name, photoUrl:profile.avatar_url});
    });
  });
};

userSchema.statics.create = function(provider, profile, cb){
  let query = {};
  query[provider] = profile[provider];
  User.findOne(query, (err, user)=>{
    if(user){return cb(err, user);}

    let u = new User(profile);
    u.save(cb);
  });
};

userSchema.methods.token = function(){
  let payload = {
    sub: this._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };

  return jwt.encode(payload, process.env.TOKEN_SECRET);
};

userSchema.statics.register = function(o, cb){
  User.findOne({email:o.email}, function(err, user){
    if(user){return cb(true);}

    user = new User(o);
    user.password = bcrypt.hashSync(o.password, 8);
    user.save(cb);
  });
};

userSchema.statics.authenticate = function(o, cb){
  User.findOne({email:o.email}, '+password', function(err, user){
    if (!user) {return cb(true);}

    let isGood = bcrypt.compareSync(o.password, user.password);
    if (!isGood) {return cb(true);}

    user.password = null;
    cb(null, user);
  });
};

User = mongoose.model('User', userSchema);
module.exports = User;
