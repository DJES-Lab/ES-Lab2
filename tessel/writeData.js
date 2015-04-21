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
var batchSize = 10;
var accelVec = require('./accelerometer').accelVec;
var accelVecArray = [];
for (var i = 0; i < batchSize; i++) {
    accelVecArray.push({})
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
            //console.log(accelVec);
            accelVecArray[i].x = accelVec.x;
            accelVecArray[i].y = accelVec.y;
            accelVecArray[i].z = accelVec.z;
            i++;
            if (i == batchSize) {
                //console.log(accelVecArray);
                //var fileName = 'accelData' + fileID + '.txt';
                fs.writeFile('accelData.txt', JSON.stringify(accelVecArray).slice(1, -1) + ',', function (err) {
                    console.log('Write complete');
                });
                //fs.appendFile('accelData.txt', JSON.stringify('asdanhosdjfoajofwioahnfiojoiwiofanhffniolnhjiwohfoiawnhfilhawiuh'), function (err) {
                //    console.log('Write complete');
                //});
                //fs.appendFileSync('accelData.txt', JSON.stringify(accelVecArray).slice(1, -1) + ',', 'utf8');
                i = 0;
                //fileID++;
            }
        }, 1000);
    });
});