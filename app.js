
/**
 * Module dependencies
 */

var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    RedisStore = require('connect-redis')(session),
    db = require('./lib/db/redis'),
    Nohm = require('nohm').Nohm,
    config = require('./lib/config/config');

db.on('connect', function() {
    Nohm.setPrefix('comment-app');
    Nohm.setClient(db);
});

var app = express();
var pass = require('./lib/config/pass');

/**
 * Configuration
 */
// all environments
app.set('views', __dirname + '/views');

app.use(express.static(__dirname+'/public'));

app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view options', {
    layout: false
});

//==============EXPRESS==============
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
    secret: config.secret,
    store: new RedisStore(),
    saveUninitialized: true,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

require('./lib/config/routes')(app);

/**
 * Start Server
 */
app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});
