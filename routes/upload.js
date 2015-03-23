/**
 * Created by chen on 2015/3/23.
 */
var upload = require('jquery-file-upload-middleware');

upload.configure({
    uploadDir: __dirname + '/public/uploads',
    uploadUrl: '/uploads',
    imageVersions: {
        thumbnail: {
            width: 80,
            height: 80
        }
    }
});
