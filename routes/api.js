/*
 * Serve JSON to our AngularJS client
 */

// GET

var utilsComments = require('../lib/utilsComments');

exports.comment = function(req, res) {
    console.log("api/comment received");
    utilsComments.get(req)
        .then(function(commentsObj) {
            res.header('Accept-Ranges', 'items');
            res.header('Range-Unit', 'items');
            res.header('Content-Range', commentsObj.contentRange);

            if (commentsObj.comments.length) {
                res.jsonp(commentsObj.comments);
            } else {
                console.log('No content');
                res.jsonp(204);
            }
        })
        .catch(function(err) {
            res.jsonp(500, {error: err});
        })
        .done();
};

// POST

exports.addComment = function(req, res) {
    console.log("api/addComment received");
    utilsComments.add(req)
        .then(function(reply) {
            res.jsonp(reply);
        })
        .catch(function(err) {
            res.jsonp(500, {error: err});
        })
        .done();
};

exports.editComment = function(req, res) {

};

exports.deleteComment = function(req, res) {

};