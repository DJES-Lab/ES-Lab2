/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('commentApp')
    .factory('Session', function($resource) {
        return $resource('/auth/session/');
    });
