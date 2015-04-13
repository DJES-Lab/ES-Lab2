/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('app')
    .controller('signupController', function($scope, Auth, $location) {
        $scope.register = function(form) {
            Auth.createUser({
                username:$scope.user.username,
                password: $scope.user.password
            }, function(err) {
                $scope.errors = {};

                if (!err) {
                    $location.path('/');
                } else {
                    angular.forEach(err.errors, function(error, field) {
                        form[field].$setValidity('redis', false);
                        $scope.errors[field] = error.type;
                    })
                }
            })
        }
    });