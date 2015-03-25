
/**
 * Module dependencies
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    routes = require('./routes'),
    api = require('./routes/api'),
    upload = require('./routes/upload');

var app = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 1234);
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view options', {
  layout: false
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname+'/public'));

/**
 * Routes
 */

// serve index and view pages
app.get('/', routes.index);
app.get('/pages/:name', routes.pages);

// JSON API
app.get('/api/comment', api.comment);

app.post('/api/addComment', api.addComment);
app.post('/api/editComment', api.editComment);
app.post('/api/deleteComment', api.deleteComment);

// upload handler
app.get('/upload', upload.get);
app.post('/upload', upload.post);
app.delete('/uploaded/files/:name', upload.delete);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
 * Start Server
 */

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
