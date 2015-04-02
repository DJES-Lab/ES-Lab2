/**
 * Created by derek on 2015/3/26.
 */

var config = require('../config/config');
var db = require('redis').createClient({
    host: config.db.host,
    port: config.db.port
});

module.exports = db;