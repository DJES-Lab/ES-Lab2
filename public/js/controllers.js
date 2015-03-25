'use strict';

/* Controllers */

angular.module('commentApp.controllers', [])
    .controller('guestController', function ($scope) {
    // write Ctrl here

    })
    .controller('homeController', ["$scope", "$http", "$upload", "$location", function ($scope, $http, $upload, $location) {

        $scope.comments = [];

        $scope.showImageUpload = false;

        $scope.sticker = {
            selectedId: 0,
            stickerIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        };

        $scope.comment = {
            name: "",
            input: "",
            sticker: 0,
            imageUrl: ""
        };

        $scope.imageFiles = [];

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
            if (!!$scope.comment.username) {
                if (!!$scope.comment.input || !!$scope.sticker.selectedId || !!$scope.imageFiles.length) {
                    var postComment = function(uploadedImageUrl) {
                        $http.post('/api/addComment', {
                            name: $scope.comment.username,
                            input: $scope.comment.input,
                            sticker: $scope.sticker.selectedId,
                            imageUrl: uploadedImageUrl
                        })
                            .success(function (data, status, headers, config) {
                                $scope.reloadPage = true;
                                $scope.comment = {
                                    username: "",
                                    input: ""
                                };
                                $scope.sticker.selectedId = 0;
                                $scope.imageFiles.length = 0;
                                $location.path('/home');
                            });
                    };

                    if ($scope.imageFiles.length) {
                        $upload.upload({
                            url: '/upload',
                            file: $scope.imageFiles[0]
                        })
                            .success(function(data, status, headers, config) {
                                postComment(data.files[0].url);
                            });
                    } else {
                        postComment("");
                    }
                } else {
                    console.log("At least one type of comments is required!");
                }
            } else {
                console.log("User Name is required!");
            }
        };
    }]);