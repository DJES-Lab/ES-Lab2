
var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['D']);

//var fsReady = false;
//var fs = null;
var accelVec = exports.accelVec = {
    x: 0.00,
    y: 0.00,
    z: 0.00
};



// Initialize the accelerometer.
accel.on('ready', function () {

    accel.setOutputRate(2.0, function () {
        console.log('Output rate is changed to 2.0 Hz')
    });

    // Stream accelerometer data
    accel.on('data', function (xyz) {
        console.log('x:', xyz[0].toFixed(2),
            'y:', xyz[1].toFixed(2),
            'z:', xyz[2].toFixed(2));
        accelVec.x = xyz[0].toFixed(2);
        accelVec.y = xyz[1].toFixed(2);
        accelVec.z = xyz[2].toFixed(2);

        //if (fsReady) {
        //    fs.appendFile('accelData.txt', JSON.stringify(xyz), function (err) {
        //        console.log('Write complete');
        //    });
        //}
        //else {
        //    console.log('File system is not ready')
        //}
    });

});

accel.on('error', function(err){
    console.log('Error:', err);
});