'use strict';

module.exports = [
  {method: 'get', path: '/{param*}', config: require('../routes/general/static')},

  {method: 'post', path: '/auth/login', config: require('../routes/users/login')},
  {method: 'post', path: '/auth/signup', config: require('../routes/users/register')},
  {method: 'post', path: '/auth/github', config: require('../routes/users/github')},
  {method: 'get', path: '/auth/twitter', config: require('../routes/users/twitter')}
];
