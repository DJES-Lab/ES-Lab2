/**
 * Created by derek on 2015/3/26.
 */

var auth = require('../config/auth');
//var enforceSingleSession = require('express-single-session')('id');

module.exports = function(app) {
    // User routes
    var users = require('../controllers/users');
    //app.post('/auth/users', users.create, auth.enforceSingleSession, function(req, res) {
    //    res.json(req.user.allProperties());
    //});
    app.post('/auth/users', users.create);
    app.get('/auth/users', auth.ensureAuthenticated, users.show);
    app.put('/auth/users/', auth.ensureAuthenticated, users.update);
    app.delete('/auth/users/', auth.ensureAuthenticated, users.destroy);
    app.get('/auth/check_username/:username', users.exists);
    app.post('/auth/confirm_password/', auth.ensureAuthenticated, users.confirmPassword);

    // Session routes
    var session = require('../controllers/session');
    app.get('/auth/session', auth.ensureAuthenticated, session.session);
    //app.post('/auth/session', session.login, auth.enforceSingleSession, function(req, res) {
    //    res.json(req.user.allProperties());
    //});
    app.post('/auth/session', session.login);
    app.delete('/auth/session', session.logout);

    // Comment routes
    var comments = require('../controllers/comments');
    app.get('/api/comments', auth.ensureAuthenticated, comments.get);
    app.post('/api/comments', auth.ensureAuthenticated, comments.create);
    app.get('/api/comments/:commentId', auth.ensureAuthenticated, comments.show);
    app.put('/api/comments/:commentId', auth.ensureAuthenticated, auth.comment.hasAuthorization, comments.update);
    app.delete('/api/comments/:commentId', auth.ensureAuthenticated, auth.comment.hasAuthorization, comments.destroy);

    app.param('commentId', comments.comment);

    var upload = require('../controllers/upload');
    app.get('/api/upload', auth.ensureAuthenticated, upload.get);
    app.post('/api/upload', auth.ensureAuthenticated, upload.post);
    app.delete('/uploaded/files/:name', auth.ensureAuthenticated, upload.delete);

    // Tessel api
    var tesselApis = require('../controllers/tessel-apis');
    app.get('/api/tessel/data', tesselApis.get);
    app.post('/api/tessel/data', tesselApis.create);
    app.get('/api/tessel/data/:dataId', tesselApis.show);
    app.put('/api/tessel/data/:dataId', tesselApis.update);
    app.delete('/api/tessel/data/:dataId', tesselApis.destroy);

    app.param('dataId', tesselApis.data);

    // serve index and view pages
    var routes = require('../controllers/index');
    app.get('/', routes.index);
    app.get('/partials/:name', routes.pages);

    // redirect all others to the index (HTML5 history)
    app.get('*', routes.index);
};