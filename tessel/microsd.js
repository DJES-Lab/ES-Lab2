// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
 This MicroSD card example writes a text file
 to the sd card, then reads the file to the
 console.
 *********************************************/

var tessel = require('tessel');
var sdcardlib = require('sdcard');
var http = require('http');
http.post = require('./httpJsonPost');
var config = require('./config');

var url = 'http://' + config.host + ':' + config.port;

var sdcard = sdcardlib.use(tessel.port['B']);

sdcard.on('ready', function() {
    sdcard.getFilesystems(function(err, fss) {
        var fs = fss[0];
        console.log('Writing...');

        fs.readFile('accelData.txt', function(err, data) {
            console.log('Read:\n', data.toString());
            //console.log(data);
            //var temp = JSON.parse('[' + data.toString().slice(0, -1) + ']');
            //console.log(temp);

            //http.post(url + '/test', data.toString().slice(0, -1), function(res){
            //    res.setEncoding('utf8');
            //    res.on('data', function(chunk) {
            //        console.log(chunk);
            //    });
            //});
        });

    });
});