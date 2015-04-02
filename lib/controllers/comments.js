/**
 * Created by derek on 2015/3/31.
 */
var Promise = require('bluebird'),
    CommentUtil = require('../utils/commentUtil');

exports.comment = function(req, res, next, id) {
    CommentUtil.getCommentById(id)
        .then(function(comment) {
            req.comment = comment;
            next();
        })
        .catch(function(err) {
            if (err == 'not found') {
                return next(new Error('Failed to load comment ' + id));
            } else {
                return next(err);
            }
        });
};

exports.get = function(req, res) {
    console.log("api/comments received");
    CommentUtil.getComments(req)
        .then(function(commentsObj) {
            res.header('Accept-Ranges', 'items');
            res.header('Range-Unit', 'items');
            res.header('Content-Range', commentsObj.contentRange);

            if (commentsObj.comments.length) {
                res.json(commentsObj.comments);
            } else {
                console.log('No content');
                res.sendStatus(204);
            }
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
        .done();
};

exports.show = function(req, res) {
    res.json(req.comment.allProperties());
};

exports.create = function(req, res) {
    CommentUtil.createComment(req)
        .then(function(comment) {
            res.json(comment);
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
};

exports.update = function(req, res) {
    CommentUtil.updateComment(req)
        .then(function(comment) {
            res.json(comment);
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
};

exports.destroy = function(req, res) {
    CommentUtil.destroyComment(req)
        .then(function(comment) {
            res.json(comment);
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
};