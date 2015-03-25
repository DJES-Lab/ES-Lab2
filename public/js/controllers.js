'use strict';

/* Controllers */

angular.module('commentApp.controllers', [])
    .controller('guestController', function ($scope) {
    // write Ctrl here

    })

    .controller('homeController', ["$scope", "$http", "$location", "FileUploader", function ($scope, $http, $location, FileUploader) {
        $scope.options = {
            url: '/upload',
            removeAfterUpload: true,
            queueLimit: 1
        };

        var uploader = $scope.uploader = new FileUploader($scope.options);

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif'.indexOf(type) !== -1;
            }
        });

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

        $scope.submitComment = function() {
            if (!!$scope.comment.username && !!$scope.comment.input) {
                $http.post('/api/addComment', {
                    name: $scope.comment.username,
                    input: $scope.comment.input
                })
                .success(function(data, status, headers, config) {
                    $scope.reloadPage = true;
                    $scope.comment = {
                        username: "",
                        input: ""
                    };
                    $location.path('/home');
                });
            }
            if (uploader.queue.length) {
                uploader.queue[0].upload();
            }
        };

        $scope.showImageUpload = false;

        $scope.image = {
            isOpen: false,
            selectedImg: 0,
            imgIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        };
    }]);