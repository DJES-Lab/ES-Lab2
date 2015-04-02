/**
 * Created by derek on 2015/3/30.
 */
angular.module('commentApp')
    .controller('commentsController', function ($rootScope, $scope, $http, $upload, $location) {

        $scope.comments = [];

        $scope.showImageUpload = false;
        $scope.editMode = false;

        $scope.sticker = {
            stickerIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        };

        $scope.comment = {
            content: "",
            stickerId: 0,
            imageUrl: ""
        };

        $scope.imageFiles = [];

        $scope.orderOptions = [
            {group: 'User Name', title: 'Ascend', order: 'creator.username'},
            {group: 'User Name', title: 'Descend', order: '-creator.username'},
            {group: 'Time', title: 'Ascend', order: 'creationTime'},
            {group: 'Time', title: 'Descend', order: '-creationTime'}
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
            if (!!$scope.comment.content || !!$scope.comment.stickerId || !!$scope.imageFiles.length) {
                var postComment = function(uploadedImageUrl) {
                    $http.post('/api/comments', {
                        content: $scope.comment.content,
                        stickerId: $scope.comment.stickerId,
                        imageUrl: uploadedImageUrl
                    })
                        .success(function (data, status, headers, config) {
                            $scope.reloadPage = true;
                            $scope.comment = {
                                content: ""
                            };
                            $scope.comment.stickerId = 0;
                            $scope.imageFiles.length = 0;
                            $location.path('/comments');
                        });
                };

                if ($scope.imageFiles.length) {
                    $upload.upload({
                        url: 'api/upload',
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
        };

        $scope.deleteComment = function(comment) {
            $http({
                method: 'DELETE',
                url: 'api/comments/' + comment.id
            })
                .success(function (data, status, headers, config) {
                    if (comment.imageUrl) {
                        $http({
                            method: 'DELETE',
                            url: comment.imageUrl
                        })
                    }
                    $location.path('/comments');
                    $scope.comments = _.without($scope.comments, comment);
                    $scope.reloadPage = true;
                });
        };

        $scope.editComment = function(comment) {
            $scope.editMode = true;
            $scope.comment = {
                id: comment.id,
                content: comment.content,
                stickerId: comment.stickerId,
                imageUrl: comment.imageUrl,
                oldImageUrl: comment.imageUrl
            };
        };

        $scope.cancelEditComment = function() {
            $scope.editMode = false;
            $scope.comment = {
                content: "",
                stickerId: 0,
                imageUrl: ""
            };
            $scope.imageFiles.length = 0;
        };

        $scope.updateComment = function() {
            if (!!$scope.comment.content || !!$scope.comment.stickerId || !!$scope.imageFiles.length) {
                var updateComment = function(uploadedImageUrl) {
                    $http({
                        method: 'PUT',
                        url: 'api/comments/' + $scope.comment.id,
                        data: {
                            content: $scope.comment.content,
                            stickerId: $scope.comment.stickerId,
                            imageUrl: uploadedImageUrl
                        }
                    })
                        .success(function (data, status, headers, config) {
                            $scope.reloadPage = true;
                            $scope.comment = {
                                content: "",
                                stickerId: 0,
                                imageUrl: ""
                            };
                            $scope.imageFiles.length = 0;
                            $scope.editMode = false;
                            $location.path('/comments');
                        });
                };

                if ($scope.comment.imageUrl !== $scope.comment.oldImageUrl) {
                    $http({
                        method: 'DELETE',
                        url: $scope.comment.oldImageUrl
                    })
                }

                if ($scope.imageFiles.length) {
                    $upload.upload({
                        url: 'api/upload',
                        file: $scope.imageFiles[0]
                    })
                        .success(function(data, status, headers, config) {
                            updateComment(data.files[0].url);
                        });
                } else {
                    updateComment("");
                }
            } else {
                console.log("At least one type of comments is required!");
            }
        };
    });