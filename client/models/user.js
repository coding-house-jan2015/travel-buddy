'use strict';

angular.module('angular-prototype')
.factory('User', ['$http', function($http){

  function update(userId, user){
    return $http.put(`/users/${userId}`, user);
  }

  return {update:update};
}]);
