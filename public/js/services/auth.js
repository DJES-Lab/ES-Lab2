/**
 * Created by derek on 2015/3/30.
 */
'use strict';

angular.module('commentApp')
    .factory('Auth', function Auth($location, $rootScope, Session, User, $cookieStore) {
        $rootScope.currentUser = $cookieStore.get('user') || null;
        $cookieStore.remove('user');

        return {
            login: function(provider, user, callback) {
                var cb = callback || angular.noop;
                Session.save({
                    provider: provider,
                    username: user.username,
                    password: user.password,
                    rememberMe: user.rememberMe
                }, function(user) {
                    $rootScope.currentUser = user;
                    return cb();
                }, function(err) {
                    return cb(err.data);
                });
            },

            logout: function(callback) {
                var cb = callback || angular.noop;
                Session.delete(function(res) {
                    $rootScope.currentUser = null;
                    return cb();
                }, function(err) {
                    return cb(err.data);
                });
            },

            createUser: function(userinfo, callback) {
                var cb = callback || angular.noop;
                User.save(userinfo, function(user) {
                    $rootScope.currentUser = user;
                    return cb();
                }, function(err) {
                    return cb(err.data);
                });
            },

            currentUser: function() {
                Session.get(function(user) {
                    $rootScope.currentUser = user;
                });
            },

            changePassword: function(username, oldPassword, newPassword, callback) {
                var cb = callback || angular.noop;
                User.update({
                    username: username,
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }, function(user) {
                    console.log('password changed');
                    return cb();
                }, function(err) {
                    return cb(err.data);
                });
            },

            removeUser: function(username, password, callback) {
                var cb = callback || angular.noop;
                User.delete({
                    username: username,
                    password: password
                }, function(user) {
                    console.log(user + 'removed');
                    return cb();
                }, function(err) {
                    return cb(err.data);
                });
            }
        };
    });