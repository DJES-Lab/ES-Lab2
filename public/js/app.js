'use strict';

// Declare app level module which depends on filters, and services

angular.module('commentApp', [
  'ngRoute',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'http-auth-interceptor',
  'ui.bootstrap',
  'ui.select',
  'bgf.paginateAnything',
  'angularFileUpload'
  //'commentApp.controllers',
  //'commentApp.filters'
  //'commentApp.services'
  //'commentApp.directives'
])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main.html',
                controller: 'mainController'
            })
            .when('/comments', {
                templateUrl: 'partials/comments.html',
                controller: 'commentsController'
            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'loginController'
            })
            .when('/signup', {
                templateUrl: 'partials/signup.html',
                controller: 'signupController'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    })
    .run(function($rootScope, $location, Auth) {
        $rootScope.$watch('currentUser', function(currentUser) {
            if (!currentUser && (['/login', '/logout', '/signup'].indexOf($location.path()) == -1)) {
                Auth.currentUser();
            }

            $rootScope.$on('event:auth-loginRequired', function() {
                $location.path('/login');
                return false;
            })
        })
    });
