/**
 * Created by derek on 2015/3/26.
 */

var passport = require('passport'),
    sessionUtil = require('../utils/sessionUtil');

/**
 * Session
 * returns info on authenticated user
 */
exports.session = function(req, res) {
    res.json(req.user.allProperties());
};

/**
 * Logout
 * returns nothing
 */
exports.logout = function(req, res) {
    if (req.user) {
        sessionUtil.untrackSession(req.user.id, req.sessionID, req.session);
        req.session.destroy();
        res.sendStatus(200);
    } else {
        res.status(400).send("Not logged in");
    }
};

/**
 * Login
 * requires: {username, password}
 */
exports.login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        var error = err || info;
        if (error) { return res.status(400).json(error); }
        req.logIn(user, function(err) {
            if (err) { return res.send(err); }
            sessionUtil.trackSession(user.id, req.sessionID, req.session);
            res.json(user.allProperties());
        });
    })(req, res, next);
};