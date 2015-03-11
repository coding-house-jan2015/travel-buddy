'use strict';

angular.module('angular-prototype', ['ui.router', 'ngMessages', 'satellizer'])
  .config(['$stateProvider', '$urlRouterProvider', '$authProvider', function($stateProvider, $urlRouterProvider, $authProvider){
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {url:'/', templateUrl:'/views/general/home.html'})
      .state('faq', {url:'/faq', templateUrl:'/views/general/faq.html'})
      .state('contact', {url:'/contact', templateUrl:'/views/general/contact.html'})

      .state('vacations', {url:'/vacations', templateUrl:'/views/vacations/vacations.html', abstract:true})
      .state('vacations.list', {url:'', templateUrl:'/views/vacations/vacations_list.html', controller:'VacationsListCtrl'})
      .state('vacations.new', {url:'/new', templateUrl:'/views/vacations/vacations_new.html', controller:'VacationsNewCtrl'})
      .state('vacations.show', {url:'/{vacationId}', templateUrl:'/views/vacations/vacations_show.html', controller:'VacationsShowCtrl'})

      .state('register', {url:'/register', templateUrl:'/views/users/users.html', controller:'UsersCtrl'})
      .state('login', {url:'/login', templateUrl:'/views/users/users.html', controller:'UsersCtrl'});

    $authProvider.github({clientId:'09953be0d1b0653a75e9'});
    $authProvider.twitter({url: '/auth/twitter'});
  }])
  .run(['$rootScope', '$window', '$auth', function($rootScope, $window, $auth){
    if($auth.isAuthenticated()){
      $rootScope.user = JSON.parse($window.localStorage.user);
    }
  }]);
