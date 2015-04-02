/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('commentApp')
    .controller('navbarController', ["$scope", "Auth", "$location", function($scope, Auth, $location) {
        $scope.menu = [];

        $scope.authMenu = [{
            "title": "Comments",
            "link": "comments/"
        }];

        $scope.logout = function() {
            Auth.logout(function(err) {
                if (!err) {
                    $location.path('/login');
                }
            });
        };
    }]);