/**
 * Created by chen on 2015/3/23.
 */
var upload = require('jquery-file-upload-middleware');

upload.configure({
    uploadDir: __dirname + '/../public/uploads',
    uploadUrl: '/uploads'
});

exports.upload = function(req, res, next) {
    upload.fileHandler()(req, res, next);};