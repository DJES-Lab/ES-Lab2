/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('app')
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
