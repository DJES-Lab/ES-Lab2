/**
 * Created by derek on 2015/3/26.
 */

var Nohm = require('nohm').Nohm,
    User = require('../models/user'),
    sessionUtil = require('../utils/sessionUtil');

/**
 * Create user
 * requires: {username, password}
 * returns: {username, password}
 */
exports.create = function(req, res, next) {
    var data = req.body;
    var newUser = Nohm.factory('User');
    newUser.store(data, function(err) {
        if (err) {
            return res.status(400).json(err);
        } else {
            req.logIn(newUser, function (err) {
                if (err) {
                    return next(err);
                } else {
                    sessionUtil.trackSession(newUser.id, req.sessionID, req.session);
                    return res.json(newUser.allProperties());
                }
            });
        }
    });
};

/**
 * Show profile
 * returns {username, profile}
 */
exports.show = function(req, res, next) {
    var user = req.user;
    if (!user) {
        res.status(404).send('USER_NOT_FOUND');
    } else {
        res.json(user.allProperties());
    }
};

/**
 * Update User
 * returns {username, profile}
 */
exports.update = function(req, res, next) {
    var user = req.user;
    if (!user) {
        res.status(404).send('USER_NOT_FOUND');
    } else {
        user.store({
            password: req.body.newPassword
        }, function(err) {
            if (err) {
                return res.status(400).json(err);
            } else {
                return res.json(user.allProperties());
            }
        });
    }
};

/**
 * Destroy User
 * returns {user}
 */
exports.destroy = function(req, res, next) {
    var user = req.user;
    if (!user) {
        res.status(404).send('USER_NOT_FOUND');
    } else {
        sessionUtil.untrackAllSessions(user.id);
        user.remove(function(err) {
            if (err) {
                return res.status(500).json(err);
            } else {
                return res.status(200).json(user.allProperties());
            }
        });
    }
};

/**
 * Username exists
 * returns {exists}
 */
exports.exists = function(req, res, next) {
    var username = req.params.username;
    User.find({
        username: username
    }, function(err, ids) {
        if (err) {
            return next(new Error('Failed to load User ' + username));
        }
        if (ids.length) {
            res.json({exists: true});
        } else {
            res.json({exists: false});
        }
    });
};

/**
 * Confirm User's Password
 * returns {confirmed}
 */
exports.confirmPassword = function(req, res, next) {
    var user = req.user;
    if (!user) {
        res.status(404).send('USER_NOT_FOUND');
    } else {
        if (user.authenticate(req.body.password)) {
            res.json({confirmed: true});
        } else {
            res.json({confirmed: false});
        }
    }
};