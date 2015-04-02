/**
 * Created by derek on 2015/3/26.
 */

var Nohm = require('nohm').Nohm,
    User = require('../models/user');

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
    var userId = req.params.userId;
    var user = Nohm.factory('User', userId, function(err) {
        if (err === 'not found') {
            res.status(404).send('USER_NOT_FOUND');
        } else if (err) {
            return next(new Error('Failed to load User'));
        } else {
            res.json(user.allProperties());
        }
    });
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