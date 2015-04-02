/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('commentApp')
    .constant('focusConfig', {
        focusClass: 'focused'
    })

    .directive('onFocus', function(focusConfig) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elem, attr, ngModel) {
                ngModel.$focused = false;
                elem.bind('focus', function(event) {
                    elem.addClass(focusConfig.focusClass);
                    scope.$apply(function() {
                        ngModel.$focused = true;
                    });
                });
                elem.bind('blur', function(event) {
                    elem.removeClass(focusConfig.focusClass);
                    scope.$apply(function() {
                        ngModel.$focused = false;
                    });
                });
            }
        };
    });