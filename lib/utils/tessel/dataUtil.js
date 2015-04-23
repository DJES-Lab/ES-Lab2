/**
 * Created by derek on 2015/4/11.
 */
var Nohm = require('nohm').Nohm,
    Data = require('../../models/tessel/data'),
    Promise = require('bluebird'),
    fileUtil = require('../fileUtil');

var assertValidRange = function(range) {
    var state = {
        isValid: true
    };

    if (/^[0-9]{1,6}-[0-9]{1,6}$/.test(range) === false) {
        state.isValid = false;
    }

    var parts = range.split('-');

    if ((parseInt(parts[0], 10) < parseInt([parts[1]], 10)) === false) {
        state.isValid = false;
    } else {
        state.rangeFrom = parseInt(parts[0], 10);
        state.rangeTo = parseInt([parts[1]], 10);
    }

    return state;
};

var getDataById = exports.getDataById = function(id) {
    return new Promise(function(resolve, reject) {
        var data = Nohm.factory('Data', id, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        })
    });
};

var getTotalDataNum = function() {
    return new Promise(function(resolve, reject) {
        Data.find(function(err, ids) {
            if (err) {
                reject(err);
            } else {
                resolve(ids.length);
            }
        })
    });
};

var sortData = function(field, start, limit) {
    return new Promise(function(resolve, reject) {
        Data.sort({
            field: field,
            direction: 'DESC',
            limit: [start, limit]
        }, function(err, ids) {
            if (err) {
                reject(err);
            } else {
                Promise.map(ids, function(id) {
                    return getDataById(id)
                        .then(function(data) {
                            return data.allProperties();
                        })
                }, {
                    concurrency: 1
                })
                    .then(function(data) {
                        resolve(data);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            }
        });
    });
};

exports.createData = function(req) {
    var data = Nohm.factory('Data');
    return new Promise(function(resolve, reject) {
        data.store({
            title: req.body.title,
            accelerometerData: req.body.accelerometerData,
            climateData: req.body.climateData,
            gpsData: req.body.gpsData,
            time: req.body.time,
            creationTime: new Date().toString()
        }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(data.allProperties());
            }
        });
    });
};

exports.createMultipleData = function(req) {
    var dataArray = req.body;
    var title = '';
    return new Promise(function(resolve, reject) {
        Promise.map(dataArray, function(dataObj) {
            var data = Nohm.factory('Data');
            var dataStoreAsync = Promise.promisify(data.store, data);
            title = dataObj.title;
            return dataStoreAsync({
                title: dataObj.title,
                accelerometerData: dataObj.accelerometerData,
                climateData: dataObj.climateData,
                gpsData: dataObj.gpsData,
                time: dataObj.time,
                creationTime: new Date().toString()
            })
                .then(function() {
                    return data.allProperties();
                })
                .catch(function(err) {
                    throw err;
                });
        }, {
            concurrency: 1
        })
            .then(function(resDataArr) {
                return fileUtil.writeJSONFile('tessel/' + title + '.json', resDataArr);
            })
            .then(function(resDataArr) {
                resolve(resDataArr);
            })
            .catch(function(err) {
                reject(err);
            });

    });
};

exports.updateData = function(req) {
    var data = req.data;
    return new Promise(function(resolve, reject) {
        data.store({
            title: req.body.title,
            accelerometerData: req.body.accelerometerData,
            climateData: req.body.climateData,
            gpsData: req.body.gpsData,
            time: req.body.time,
            lastEditTime: new Date().toString()
        }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(data.allProperties());
            }
        });
    });
};

exports.destroyData = function(req) {
    var data = req.data;

    return new Promise(function(resolve, reject) {
        data.remove(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(data.allProperties());
            }
        })
    });
};

exports.getAllData = function() {
    return new Promise(function(resolve, reject) {
        getTotalDataNum()
            .then(function(totalDataNum) {
                return sortData('creationTime', 0, totalDataNum);
            })
            .then(function(data) {
                resolve(data);
            })
            .catch(function(err) {
                reject(err);
            });
    });
};

exports.getData = function(req) {
    return new Promise(function(resolve, reject) {
        if (!req.headers.range || !req.headers['range-unit']) {
            req.headers.range = "0-4";
            req.headers['range-unit'] = "items";
        }

        var range = assertValidRange(req.headers.range);

        if (!range.isValid) {
            reject('[Error] Invalid Range');
        } else {
            var limit = (range.rangeTo) - (range.rangeFrom) + 1;
            console.log(" - Querying data range: " + range.rangeFrom + "-" + range.rangeTo);

            Promise.resolve()
                .then(function() {
                    return [
                        getTotalDataNum(),
                        sortData('creationTime', range.rangeFrom, limit)
                    ];
                })
                .spread(function(dataNum, data) {
                    var contentRange;
                    if (data.length) {
                        contentRange = range.rangeFrom + '-' + (range.rangeFrom + (data.length - 1)) + '/' + dataNum;
                    } else {
                        contentRange = '*/0'
                    }
                    console.log(" - Received " + data.length + " data from database");

                    return {
                        contentRange: contentRange,
                        data: data
                    };
                })
                .then(function(dataObj) {
                    resolve(dataObj);
                })
                .catch(function(err) {
                    reject(err);
                });
        }
    });
};