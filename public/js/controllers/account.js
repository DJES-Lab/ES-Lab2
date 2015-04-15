/**
 * Created by derek on 2015/4/13.
 */
angular.module('app')
    .controller('accountController', function ($rootScope, $scope, Auth, $http, $location, growl) {
        $scope.changePasswordModel = {
            user: {
                oldPassword: "",
                newPassword: ""
            },
            errors: {}
        };
        $scope.deleteAccountModel = {
            user: {
                password: ""
            },
            errors: {}
        };

        $scope.changePassword = function(form) {
            Auth.changePassword($scope.changePasswordModel.user.oldPassword, $scope.changePasswordModel.user.newPassword, function(err) {
                $scope.changePasswordModel.errors = {};

                if (!err) {
                    $scope.changePasswordModel.user = {
                        oldPassword: "",
                        newPassword: ""
                    };
                    $scope.deleteAccountModel.user.password = "";
                    growl.success('Password changed successfully');
                    $location.path('/account');
                } else {
                    angular.forEach(err.changePasswordModel.errors, function(error, field) {
                        form[field].$setValidity('redis', false);
                        $scope.changePasswordModel.errors[field] = error.type;
                    })
                }
            })
        };

        $scope.deleteAccount = function(form) {
            Auth.removeUser(function(err) {
                $scope.deleteAccountModel.errors = {};
                if (!err) {
                    growl.success('Account deleted');
                    $location.path('/login');
                } else {
                    angular.forEach(err.deleteAccountModel.errors, function(error, field) {
                        form[field].$setValidity('redis', false);
                        $scope.deleteAccountModel.errors[field] = error.type;
                    })
                }
            });
        }
    });