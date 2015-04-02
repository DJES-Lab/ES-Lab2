/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('commentApp')
    .directive('uniqueUsername', function($http) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elem, attr, ngModel) {
                function validate(value) {
                    if (!value) {
                        ngModel.$setValidity('unique', true);
                        return;
                    }
                    $http.get('/auth/check_username/' + value)
                        .success(function(user) {
                            if (!user.exists) {
                                ngModel.$setValidity('unique', true);
                            } else {
                                ngModel.$setValidity('unique',false);
                            }
                        });
                }

                scope.$watch(function() {
                    return ngModel.$viewValue;
                }, validate);
            }
        }
    });