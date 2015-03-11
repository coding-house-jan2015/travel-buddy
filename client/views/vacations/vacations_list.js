'use strict';

angular.module('angular-prototype')
  .controller('VacationsListCtrl', ['$scope', '$state', 'Vacation', ($scope, $state, Vacation)=>{
    Vacation.all()
    .then(response=>{
      $scope.vacations = response.data.vacations;
    });

    $scope.show = function(vacation){
      $state.go('vacations.show', {vacationId:vacation._id});
    };
  }]);
