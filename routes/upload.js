/**
 * Created by derek on 2015/3/24.
 */

var options = {
    tmpDir: __dirname + '/../public/uploaded/tmp',
    uploadDir: __dirname + '/../public/uploaded/files',
    uploadUrl: '/uploaded/files/',
    storage: {
        type: 'local'
    }
};

var uploader = require('blueimp-file-upload-expressjs')(options);

exports.get = function(req, res) {
    uploader.get(req, res, function(obj) {
        res.json(obj);
    })
};

exports.post = function(req, res) {
    uploader.post(req, res, function(obj) {
        res.json(obj);
    })
};

exports.delete = function(req, res) {
    uploader.delete(req, res, function(obj) {
        res.json(obj);
    })
};