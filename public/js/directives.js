'use strict';

/* Directives */

angular.module('commentApp.directives', [])
    .directive('dragZone', function() {
        return {
            restrict: 'E',
            scope: {
                files: '='
            },
            replace: true,
            template:
                '<div ng-file-drop ng-model="files" class="comment-upload-zone" drag-over-class="comment-upload-zone-over" ng-multiple="false" ng-accept="\'.jpg,.jpeg,.png,.bmp,.gif\'">' +
                    '<div id="file-input" style="display: none;" ng-file-select ng-model="files" ng-multiple="false"></div>' +
                    '<a ng-click="triggerClick()">Drag Upload Image</a>' +
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
            template: '<img class="comment-add-image"/>',
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
