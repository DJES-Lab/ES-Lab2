/**
 * Created by derek on 2015/4/1.
 */

var Nohm = require('nohm').Nohm,
    Comment = require('../models/comment'),
    Promise = require('bluebird');

var assertValidRange = function(range) {
    var state = {
        isValid: true
    };

    if (/^[0-9]{1,6}-[0-9]{1,6}$/.test(range) === false) {
        state.isValid = false;
    }

    var parts = range.split('-');

    if ((parseInt(parts[0], 10) < parseInt([parts[1]], 10)) === false) {
        state.isValid = false;
    } else {
        state.rangeFrom = parseInt(parts[0], 10);
        state.rangeTo = parseInt([parts[1]], 10);
    }

    return state;
};

var getCommentById = exports.getCommentById = function(id) {
    return new Promise(function(resolve, reject) {
        var comment = Nohm.factory('Comment', id, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(comment);
            }
        })
    });
};

var getTotalCommentNum = function() {
    return new Promise(function(resolve, reject) {
        Comment.find(function(err, ids) {
            if (err) {
                reject(err);
            } else {
                resolve(ids.length);
            }
        })
    });
};

var sortComments = function(field, start, limit) {
    return new Promise(function(resolve, reject) {
        Comment.sort({
            field: field,
            direction: 'DESC',
            limit: [start, limit]
        }, function(err, ids) {
            if (err) {
                reject(err);
            } else {
                Promise.map(ids, function(id) {
                    return getCommentById(id)
                        .then(function(comment) {
                            return comment.allProperties();
                        })
                }, {
                    concurrency: 1
                })
                    .then(function(comments) {
                        resolve(comments);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            }
        });
    });
};

exports.createComment = function(req) {
    var comment = Nohm.factory('Comment');
    return new Promise(function(resolve, reject) {
        comment.store({
            creator: req.user.allProperties(),
            content: req.body.content,
            stickerId: req.body.stickerId,
            imageUrl: req.body.imageUrl,
            creationTime: new Date().toString()
        }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(comment.allProperties());
            }
        });
    });
};

exports.updateComment = function(req) {
    var comment = req.comment;
    return new Promise(function(resolve, reject) {
        comment.store({
            content: req.body.content,
            stickerId: req.body.stickerId,
            imageUrl: req.body.imageUrl,
            lastEditTime: new Date().toString()
        }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(comment.allProperties());
            }
        });
    });
};

exports.destroyComment = function(req) {
    var comment = req.comment;

    return new Promise(function(resolve, reject) {
        comment.remove(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(comment.allProperties());
            }
        })
    });
};

exports.getComments = function(req) {
    return new Promise(function(resolve, reject) {
        if (!req.headers.range || !req.headers['range-unit']) {
            req.headers.range = "0-4";
            req.headers['range-unit'] = "items";
        }

        var range = assertValidRange(req.headers.range);

        if (!range.isValid) {
            reject('[Error] Invalid Range');
        } else {
            var limit = (range.rangeTo) - (range.rangeFrom) + 1;
            console.log(" - Querying comment range: " + range.rangeFrom + "-" + range.rangeTo);

            Promise.resolve()
                .then(function() {
                    return [
                        getTotalCommentNum(),
                        sortComments('creationTime', range.rangeFrom, limit)
                    ];
                })
                .spread(function(commentNum, comments) {
                    var contentRange;
                    if (comments.length) {
                        contentRange = range.rangeFrom + '-' + (range.rangeFrom + (comments.length - 1)) + '/' + commentNum;
                    } else {
                        contentRange = '*/0'
                    }
                    console.log(" - Received " + comments.length + " comments from database");

                    return {
                        contentRange: contentRange,
                        comments: comments
                    };
                })
                .then(function(commentsObj) {
                    resolve(commentsObj);
                })
                .catch(function(err) {
                    reject(err);
                });
        }
    });
};