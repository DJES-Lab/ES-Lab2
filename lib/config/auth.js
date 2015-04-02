/**
 * Created by derek on 2015/3/26.
 */
/**
 * Route middleware to ensure user is authenticated
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) { return next(); }
    res.sendStatus(401);
};

/**
 * Comment authorizations routing middleware
 */
exports.comment = {
    hasAuthorization: function(req, res, next) {
        if (req.comment.allProperties().creator.id != req.user.allProperties().id) {
            return res.sendStatus(403);
        }
        next();
    }
};