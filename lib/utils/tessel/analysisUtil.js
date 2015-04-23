/**
 * Created by chen on 2015/4/23.
 */

var analHorizontalAccel = function(accelArray) {
    var horizontalAccelArray = accelArray.map(function(obj) {
        return {
            horizontalAccel: Math.sqrt(obj.x * obj.x + obj.y * obj.y + obj.z * obj.z - 1),
            time: obj.time
        };
    });
    return horizontalAccelArray;
};

var analHorizontalSpeed = function(accelArray) {
    var horizontalAccelArray = analHorizontalAccel(accelArray);
    var horizontalSpeedArray = horizontalAccelArray.map(function(obj, index) {
        if (index <= 0) {
            return {
                horizontalSpeed: 0.0,
                time: obj.time
            };
        }
        else {
            return{
                horizontalSpeed: obj.horizontalAccel - horizontalAccelArray[index-1].horizontalAccel,
                time: obj.time
            };
        }

    });
    return horizontalSpeedArray;
};

var analHorizontalDistance = function(accelArray) {
    var horizontalSpeedArray = analHorizontalSpeed(accelArray);
    var horizontalDistanceArray = horizontalSpeedArray.map(function(obj, index) {
        if (index <= 1) {
            return {
                horizontalDistance: 0.0,
                time: obj.time
            };
        }
        else {
            return{
                horizontalDistance: obj.horizontalSpeed - horizontalSpeedArray[index-1].horizontalSpeed,
                time: obj.time
            };
        }

    });
    return horizontalDistanceArray;
};

var analHorizontalVelocity = function(accelArray) {
    var horizontalVelocityArray = [];
    var sumX = 0.0;
    var sumY = 0.0;
    for (var i = 0; i < accelArray.length; i++) {
        sumX = sumX + +accelArray[i].x;
        sumY = sumY + +accelArray[i].y;
        horizontalVelocityArray[i] = {
            horizontalVelocityX: sumX,
            horizontalVelocityY: sumY,
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
        sumX = sumX + +horizontalVelocityArray[i].x;
        sumY = sumY + +horizontalVelocityArray[i].y;
        horizontalPositionArray[i] = {
            horizontalVelocityX: sumX,
            horizontalVelocityY: sumY,
            time: horizontalVelocityArray[i].time
        };
    }
    return horizontalPositionArray;
};

module.exports = {
    accelerometer: {
        analHorizontalAccel: analHorizontalAccel,
        analHorizontalSpeed: analHorizontalSpeed,
        analHorizontalDistance: analHorizontalDistance,
        analHorizontalVelocity: analHorizontalVelocity,
        analHorizontalPosition: analHorizontalPosition
    },
    climate: {}
};