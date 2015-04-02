/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('commentApp')
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
    });