'use strict';

// Declare app level module which depends on filters, and services

angular.module('commentApp', [
  'commentApp.controllers',
  'commentApp.filters',
  'commentApp.services',
  'commentApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/guest', {
      templateUrl: 'pages/guest',
      controller: 'guestController'
    }).
    when('/home', {
      templateUrl: 'pages/home',
      controller: 'homeController'
    }).
    otherwise({
      redirectTo: '/guest'
    });

  $locationProvider.html5Mode(true);
});
