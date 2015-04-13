/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('app')
    .directive('redisError', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elem, attr, ngModel) {
                elem.on('keydown', function() {
                    return ngModel.$setValidity('redis', true);
                })
            }
        }
    });