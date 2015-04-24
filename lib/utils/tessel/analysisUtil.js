/**
 * Created by chen on 2015/4/23.
 */

var analHorizontalAccel = function(accelArray) {
    var horizontalAccelArray = accelArray.map(function(obj) {
        return {
            horizontalAccel: Math.round((Math.sqrt(obj.x * obj.x + obj.y * obj.y + obj.z * obj.z - 1)) * 1e4) / 1e4,
            time: obj.time
        };
    });
    return horizontalAccelArray;
};

var analHorizontalVelocity = function(accelArray) {
    var horizontalVelocityArray = [];
    var sumX = 0.0;
    var sumY = 0.0;
    for (var i = 0; i < accelArray.length; i++) {
        sumX = sumX + accelArray[i].x;
        sumY = sumY + accelArray[i].y;
        horizontalVelocityArray[i] = {
            horizontalVelocityX: Math.round(sumX * 1e4) / 1e4,
            horizontalVelocityY: Math.round(sumY * 1e4) / 1e4,
            time: accelArray[i].time
        };
    }
    return horizontalVelocityArray;
};

var analHorizontalPosition = function(accelArray) {
    var horizontalVelocityArray = analHorizontalVelocity(accelArray);
    var horizontalPositionArray = [];
    var sumX = 0.0;
    var sumY = 0.0;
    for (var i = 0; i < horizontalVelocityArray.length; i++) {
        sumX = sumX + horizontalVelocityArray[i].horizontalVelocityX;
        sumY = sumY + horizontalVelocityArray[i].horizontalVelocityY;
        horizontalPositionArray[i] = {
            horizontalPositionX: Math.round(sumX * 1e4) / 1e4,
            horizontalPositionY: Math.round(sumY * 1e4) / 1e4,
            time: horizontalVelocityArray[i].time
        };
    }
    return horizontalPositionArray;
};

module.exports = {
    accelerometer: {
        analHorizontalAccel: analHorizontalAccel,
        analHorizontalVelocity: analHorizontalVelocity,
        analHorizontalPosition: analHorizontalPosition
    },
    climate: {}
};