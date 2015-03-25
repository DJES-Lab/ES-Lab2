'use strict';

/* Directives */

angular.module('commentApp.directives', [])
    .directive('dragZone', function() {
        return {
            restrict: 'E',
            replace: true,
            template:
                '<div nv-file-drop uploader="uploader">' +
                    '<div nv-file-over uploader="uploader" over-class="comment-upload-zone-over" class="comment-upload-zone">' +
                        '<input id="file-input" nv-file-select="" uploader="uploader" style="display: none;" type="file">' +
                        '<a ng-click="triggerClick()">Drag Upload Image</a>' +
                    '</div>' +
                '</div>',
            link: function(scope, elem) {
                scope.triggerClick = function() {
                    elem.find('#file-input').trigger('click');
                };
            }
        };
    })
    .directive('imagePreview', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<img class="comment-image"/>',
            replace: true,
            link: function(scope, elem, attr) {
                if (!helper.support) return;

                var params = scope.$eval(attr.imagePreview);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    elem.attr('src', event.target.result);
                }
            }
        };
    }]);
