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
                horizontalSpeed: obj.horizontalAccel - horizontalAccelArray[index].horizontalAccel,
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
                horizontalDistance: obj.horizontalSpeed - horizontalSpeedArray[index].horizontalSpeed,
                time: obj.time
            };
        }

    });
    return horizontalDistanceArray;
};

var analHorizontalVelocity = function(accelArray) {
    var horizontalVelocityArray = accelArray.map(function(obj, index) {
        if (index <= 0) {
            return {
                horizontalVelocityX: 0.0,
                horizontalVelocityY: 0.0,
                time: obj.time
            };
        }
        else {
            return{
                horizontalVelocityX: obj.x - accelArray[index].x,
                horizontalVelocityY: obj.y - accelArray[index].y,
                time: obj.time
            };
        }

    });
    return horizontalVelocityArray;
};

var analHorizontalPosition = function(accelArray) {
    var horizontalVelocityArray = analHorizontalVelocity(accelArray);
    var horizontalPositionArray = horizontalVelocityArray.map(function(obj, index) {
        if (index <= 1) {
            return {
                horizontalPositionX: 0.0,
                horizontalPositionY: 0.0,
                time: obj.time
            };
        }
        else {
            return{
                horizontalPositionX: obj.horizontalVelocityX - horizontalVelocityArray[index].horizontalVelocityX,
                horizontalPositionY: obj.horizontalVelocityY - horizontalVelocityArray[index].horizontalVelocityY,
                time: obj.time
            };
        }

    });
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