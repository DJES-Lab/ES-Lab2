/**
 * Created by derek on 2015/4/13.
 */
angular.module('app')
    .controller('accountController', function ($rootScope, $scope, Auth, $http, $location) {
        $scope.changePassword = function() {
            Auth.changePassword($scope.changePassword.user.oldPassword, $scope.changePassword.user.newPassword, function(err) {
                $scope.changePassword.errors = {};

                if (!err) {
                    $scope.changePassword.user = {
                        oldPassword: "",
                        newPassword: ""
                    };
                    $location.path('/account');
                } else {
                    angular.forEach(err.changePassword.errors, function(error, field) {
                        form[field].$setValidity('redis', false);
                        $scope.changePassword.errors[field] = error.type;
                    })
                }
            })
        };

        $scope.deleteAccount = function() {
            Auth.removeUser(function(err) {
                $scope.deleteAccount.errors = {};

                if (!err) {
                    $location.path('/login');
                } else {
                    angular.forEach(err.deleteAccount.errors, function(error, field) {
                        form[field].$setValidity('redis', false);
                        $scope.deleteAccount.errors[field] = error.type;
                    })
                }
            });
        }
    });