'use strict';

/* Controllers */

angular.module('commentApp.controllers', [])
    .controller('guestController', function ($scope) {
    // write Ctrl here

    })

    .controller('homeController', ["$scope", "$http", "httpi", "$location", function ($scope, $http, httpi, $location) {
        $scope.comments = [];
        $scope.orderOptions = [
            {group: 'User Name', title: 'Ascend', order: 'name'},
            {group: 'User Name', title: 'Descend', order: '-name'},
            {group: 'Time', title: 'Ascend', order: 'time'},
            {group: 'Time', title: 'Descend', order: '-time'}
        ];
        $scope.order = {
            selectedOptions: []
        };

        $scope.checkDisable = function(option) {
            var normSelectedOptions = $scope.order.selectedOptions
                .map(function(order) {
                    return order[0] == '-' ? order.slice(1) : order;
                });
            return _.includes(normSelectedOptions, option.order[0] == '-' ? option.order.slice(1) : option.order);
        };

        $scope.refresh = function() {
            //$http({
            //    method: 'GET',
            //    url: '/api/comments'
            //})
            //    .success(function (data, status, headers, config) {
            //        $scope.comments = data.comments;
            //        $scope.comments.forEach(function(comment) {
            //            comment.date = new Date(comment.time);
            //            console.log(comment.date);
            //            comment.time = Date.parse(comment.time);
            //        });
            //    })
            //    .error(function (data, status, headers, config) {
            //        console.log("error in getting comments!");
            //    });

            httpi({
                method: 'GET',
                url: '/api/comment/(:index/:number)',
                data: {
                    index: 0,
                    number: 10
                }
            })
                .success(function (data, status, headers, config) {
                    $scope.comments = data.comments;
                    $scope.comments.forEach(function(comment) {
                        comment.date = new Date(comment.time);
                        console.log(comment.date);
                        comment.time = Date.parse(comment.time);
                    });
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
