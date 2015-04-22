/**
 * Created by chen on 2015/4/17.
 */
var tessel = require('tessel');
var sdcardlib = require('sdcard');
var sdcard = sdcardlib.use(tessel.port['B']);
var http = require('http');
http.post = require('./httpJsonPost');
var config = require('./config');

var url = 'http://' + config.host + ':' + config.port;

//var fileID = 0;
var batchSize = 8;
var accelerometerData = require('./accelerometer').accelerometerData;
var climateData = require('./climate').climateData;
var gpsData = require('./gps').gpsData;
var data = [];
for (var i = 0; i < batchSize; i++) {
    data.push({
        accelerometerData: {},
        climateData: {}
    })
}

sdcard.on('ready', function() {
    sdcard.getFilesystems(function(err, fss) {
        fs = fss[0];

        // Initialize the file 'accelData.txt'
        //fs.writeFile('accelData.txt', '', function(err) {
        //    console.log('Initializing the file accelData.txt...');
        //    //fsReady = true;
        //});
        console.log('File System is ready');

        var i = 0;
        setInterval(function() {
            //console.log(accelerometerData);
            data[i].accelerometerData.x = accelerometerData.x;
            data[i].accelerometerData.y = accelerometerData.y;
            data[i].accelerometerData.z = accelerometerData.z;
            data[i].climateData.degree = climateData.degree;
            data[i].climateData.humidity = climateData.humidity;
            i++;
            if (i == batchSize) {
                //console.log(data);
                //var fileName = 'accelData' + fileID + '.txt';
                fs.writeFile('accelData.txt', JSON.stringify(data).slice(1, -1) + ',', function (err) {
                    console.log('Write complete');
                });

                //fs.appendFileSync('accelData.txt', JSON.stringify(data).slice(1, -1) + ',', 'utf8');
                i = 0;
                //fileID++;
            }
        }, 1000);
    });
});
