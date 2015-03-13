'use strict';

angular.module('angular-prototype')
.controller('UsersProfileCtrl', ['$rootScope', '$scope', '$state', '$window', 'User', function($rootScope, $scope, $state, $window, User){
  $scope.submit = function(user){
    User.update(user._id, {displayName:user.displayName, photoUrl:user.photoUrl, phone:user.phone})
    .then(response=>{
      $rootScope.user = response.data;
      $window.localStorage.user = JSON.stringify(response.data);
      $state.go('home');
    });
  };
}]);
