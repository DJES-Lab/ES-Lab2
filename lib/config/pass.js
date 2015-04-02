/**
 * Created by derek on 2015/3/30.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Nohm = require('nohm').Nohm,
    User = require('../models/user');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var user = Nohm.factory('User', id, function(err) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
        userNameField: 'username',
        passwordField: 'password'
    }, function(username, password, done) {
        User.find({ username: username }, function(err, ids) {
            if (err) {
                return done(err);
            }
            if (!ids.length) {
                return done(null, false, {
                    'errors': {
                        'username': { type: 'Username is not registered.' }
                    }
                });
            } else {
                var user = Nohm.factory('User', ids[0], function(err) {
                    if (err) {
                        return done(err);
                    } else {
                        if (!user.authenticate(password)) {
                            return done(null, false, {
                                'errors': {
                                    'password': { type: 'Password is incorrect.' }
                                }
                            });
                        }
                        return done(null, user);
                    }
                });
            }
        })
    }
));