/*
 * Serve JSON to our AngularJS client
 */

// GET

var db = require('then-redis').createClient();

exports.comments = function(req, res) {
    console.log("api/comments received");

    db.sort("all:messages", "DESC",
        "get", "message_*->name",
        "get", "message_*->input",
        "get", "message_*->time")
        .then(function(messages) {
            var len = messages.length / 3;
            var arr = new Array(len);
            for (var i = 0; i < len; i++) {
                arr[i] = {
                    name: messages[3 * i],
                    input: messages[3 * i + 1],
                    time: messages[3 * i + 2]
                };
            }
            res.json({
                comments: arr
            });
        });
};

exports.comment = function(req, res) {
    var startIndex = req.params.index;
    var messageNum = req.params.number;

    console.log("api/comment/:" + startIndex + "/:" + messageNum + " received");

    db.sort("all:messages", "DESC",
        "LIMIT", startIndex, messageNum,
        "get", "message_*->name",
        "get", "message_*->input",
        "get", "message_*->time")
        .then(function(messages) {
            var len = messages.length / 3;
            var arr = new Array(len);
            for (var i = 0; i < len; i++) {
                arr[i] = {
                    name: messages[3 * i],
                    input: messages[3 * i + 1],
                    time: messages[3 * i + 2]
                };
            }
            res.json({
                comments: arr
            });
        });
};

// POST

exports.addComment = function(req, res) {
    console.log("api/addComment received");

    db.llen('all:messages')
        .then(function(len) {
            db.lpush('all:messages', len + 1)
                .then(function(len) {
                    var objName = "message_" + (len);
                    var message = {
                        name: req.body.name,
                        input: req.body.input,
                        time: new Date().toString()
                    };
                    db.hmset(objName, message)
                        .then(function(reply) {
                            res.json(reply);
                        });
                });
        });
};

exports.editComment = function(req, res) {

};

exports.deleteComment = function(req, res) {

};