/**
 * Created by derek on 2015/3/22.
 */

var Promise = require('bluebird');
var db = require('then-redis').createClient();

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

var execQuery = function(queryName, queryArguments) {
    return new Promise(function(resolve, reject) {
        db.send(queryName, queryArguments)
            .then(function(ret) {
                resolve(ret);
            })
            .catch(function(err) {
                console.error('[Error] Executing ' + queryName + ': ' + err.toString());
                reject('The query' + queryName + 'with arguments' + queryArguments + 'is invalid!');
            });
    });
};

var count = function() {
    return new Promise(function(resolve, reject) {
        execQuery('llen', ['all:comments'])
            .then(function(len) {
                resolve(len);
            })
            .catch(function(err) {
                console.error(err.toString());
                reject('[Error] Cannot get the number of comments');
            })
    });
};

exports.get = function(req) {
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
                        count(),
                        execQuery('sort', [
                            'all:comments', 'DESC',
                            'LIMIT', range.rangeFrom, limit,
                            'get', 'comment_*->name',
                            'get', 'comment_*->input',
                            'get', 'comment_*->sticker',
                            'get', 'comment_*->imageUrl',
                            'get', 'comment_*->time'
                        ])
                            .then(function(messages) {
                                var len = messages.length / 5;
                                var comments = new Array(len);
                                for (var i = 0; i < len; i++) {
                                    comments[i] = {
                                        name: messages[5 * i],
                                        input: messages[5 * i + 1],
                                        sticker: messages[5 * i + 2],
                                        imageUrl: messages[5 * i + 3],
                                        time: messages[5 * i + 4]
                                    };
                                }
                                return comments;
                            })
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

exports.add = function(req) {
    return new Promise(function(resolve, reject) {
        count()
            .then(function(commentNum) {
                execQuery('lpush', ['all:comments', commentNum + 1])
                    .then(function(newCommentId) {
                        console.log(' - Got a new comment: id = ' + newCommentId);
                        var commentName = 'comment_' + (newCommentId);
                        var hashPair = [commentName, 'name', req.body.name, 'input', req.body.input, 'sticker', req.body.sticker, 'imageUrl', req.body.imageUrl, 'time', new Date().toString()];
                        execQuery('hmset', hashPair)
                            .then(function(reply) {
                                resolve(reply);
                            })
                            .catch(function(err) {
                                console.error(err.toString());
                                reject('[Error] Cannot set hashes to' + commentName);
                            });
                    })
                    .catch(function(err) {
                        console.log(err.toString());
                        reject('[Error] Cannot push new comment to database');
                    });

            })
            .catch(function(err) {
                reject(err);
            });
    });
};
