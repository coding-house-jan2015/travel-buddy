'use strict';

angular.module('angular-prototype')
.directive('cmStripe', [()=>{
  var o = {};

  o.restrict = 'A';
  o.templateUrl = '/directives/cm-stripe.html';
  o.scope = {
    vacation: '=',
    cost: '=',
    description: '=',
    itinerary: '='
  };
  o.controller = ['$rootScope', '$scope', ($rootScope, $scope)=>{
    $scope.purchase = function(){
      var info = {
        vacation:$scope.vacation,
        cost:$scope.cost * 100,
        description:$scope.description,
        itinerary:$scope.itinerary
      };

      $rootScope.$broadcast('purchase', info);
    };
  }];

  return o;
}]);
