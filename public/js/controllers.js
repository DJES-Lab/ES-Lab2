'use strict';

/* Controllers */

angular.module('commentApp.controllers', [])
    .controller('guestController', function ($scope) {
    // write Ctrl here

    })

    .controller('homeController', ["$scope", "$http", "$location", function ($scope, $http, $location) {
        $scope.comments = [];


        $scope.refresh = function() {
            $http({
                method: 'GET',
                url: '/api/comments'
            })
                .success(function (data, status, headers, config) {
                    $scope.comments = data.comments;
                })
                .error(function (data, status, headers, config) {
                    console.log("error in getting comments!");
                });

            $scope.comment = {
                username: "",
                input: ""
            };
        };

        $scope.submitComment = function() {
            if (!!$scope.comment.username && !!$scope.comment.input) {
                $http.post('/api/addComment', {
                    name: $scope.comment.username,
                    input: $scope.comment.input
                })
                .success(function(data, status, headers, config) {
                    $scope.refresh();
                    $location.path('/home');
                });
            }
        };

        $scope.refresh();
    }]);
