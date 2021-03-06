/* jshint expr:true */

'use strict';

require('babel/register');

var User = require('../../server/models/user');
var expect = require('chai').expect;
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
require('../../server/index');
var cp = require('child_process');
var dbname = process.env.MONGO_URL.split('/')[3];

describe('User Model', function() {
  beforeEach(function(done) {
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [dbname], {cwd:__dirname + '/../scripts'}, function(){
      done();
    });
  });

  describe('.register', function() {
    it('should register a user', function(done) {
      User.register({email:'fay@aol.com', password:'123'}, function(err, user) {
        expect(err).to.not.be.ok;
        expect(user.email).to.equal('fay@aol.com');
        expect(user.password).to.have.length(60);
        expect(user.createdAt).to.be.instanceof(Date);
        expect(user._id).to.be.ok;
        expect(user).to.be.ok;
        done();
      });
    });

    it('should NOT register a user - duplicate email', function(done) {
      User.register({email:'bob@aol.com', password:'123'}, function(err, user) {
        console.log('err', err, 'user', user);

        expect(err).to.be.ok;
        expect(user).to.not.be.ok;
        done();
      });
    });
  });

  describe('.authenticate', function() {
    it('should authenticate a user', function(done) {
      User.authenticate({email:'bob@aol.com', password:'123'}, function(err, user) {
        expect(err).to.not.be.ok;
        expect(user.email).to.equal('bob@aol.com');
        expect(user.password).to.be.null;
        expect(user.createdAt).to.be.instanceof(Date);
        expect(user._id).to.be.ok;
        expect(user).to.be.ok;
        done();
      });
    });

    it('should NOT authenticate a user - bad email', function(done) {
      User.authenticate({email:'wrong@aol.com', password:'123'}, function(err, user) {
        expect(err).to.be.ok;
        expect(user).to.not.be.ok;
        done();
      });
    });

    it('should NOT authenticate a user - bad password', function(done) {
      User.authenticate({email:'bob@aol.com', password:'wrong'}, function(err, user) {
        expect(err).to.be.ok;
        expect(user).to.not.be.ok;
        done();
      });
    });

    it('should NOT authenticate a user - bad email and password', function(done) {
      User.authenticate({email:'wrong@aol.com', password:'wrong'}, function(err, user) {
        expect(err).to.be.ok;
        expect(user).to.not.be.ok;
        done();
      });
    });
  });

  describe('.create', function() {
    it('should create a user from social login', function(done) {
      User.create('github', {github:1}, function(err, user){
        expect(err).to.not.be.ok;
        expect(user).to.be.ok;
        done();
      });
    });

    it('should find an existing user from social login', function(done) {
      User.create('github', {github:3}, function(err, user){
        expect(err).to.not.be.ok;
        expect(user._id.toString()).to.equal('000000000000000000000001');
        done();
      });
    });
  });

  describe('#token', function() {
    it('should create a token from a user', function(done) {
      User.create('github', {github:1}, function(err, user){
        var token = user.token();
        expect(token).to.have.length(172);
        done();
      });
    });
  });
});
