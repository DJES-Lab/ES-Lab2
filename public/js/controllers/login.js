/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('app')
    .controller('loginController', function($scope, Auth, $location) {
        $scope.error = {};
        $scope.user = {};

        $scope.login = function(form) {
            Auth.login('password', {
                'username': $scope.user.username,
                'password': $scope.user.password
            }, function(err) {
                $scope.errors = {};

                if (!err) {
                    $location.path('/');
                } else {
                    angular.forEach(err.errors, function(error, field) {
                        form[field].$setValidity('redis', false);
                        $scope.errors[field] = error.type;
                    });
                    $scope.error.other = err.message;
                }
            });
        }
    });