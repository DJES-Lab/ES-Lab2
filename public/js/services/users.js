/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('commentApp')
    .factory('User', function($resource) {
        return $resource('/auth/users/:id/', {}, {
            'update': {
                method: 'PUT'
            }
        });
    });