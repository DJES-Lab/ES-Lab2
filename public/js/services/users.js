/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('app')
    .factory('User', function($resource) {
        return $resource('/auth/users/', {}, {
            'update': {
                method: 'PUT'
            }
        });
    });