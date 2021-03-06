/**
 * Created by derek on 2015/4/23.
 */

var FileUtil = require('../../utils/fileUtil'),
    AnalysisUtil = require('../../utils/tessel/analysisUtil');

exports.parseJSONFile = function(req, res, next, fileName) {
    FileUtil.readJSONFile('tessel/' + fileName + '.json')
        .then(function(jsonObj) {
            req.jsonObj = {
                data: jsonObj
            };
            next();
        })
        .catch(function(err) {
            return next(err);
        });
};

exports.getData = function(req, res, next, dataType) {
    if (dataType == 'accelerometer') {
        req.jsonObj.dataType = dataType;
        req.jsonObj.data = req.jsonObj.data.map(function(data) {
            return {
                x: data.accelerometerData.x,
                y: data.accelerometerData.y,
                z: data.accelerometerData.z,
                time: data.time
            };
        });
        next();
    } else if (dataType == 'climate') {
        req.jsonObj.dataType = dataType;
        req.jsonObj.data = req.jsonObj.data.map(function(data) {
            return {
                degree: data.climateData.degree,
                humidity: data.climateData.humidity,
                time: data.time
            };
        });
        next();
    } else {
        return next(new Error('No such data type "' + dataType + '"'));
    }
};

exports.getMethod = function(req, res, next, method) {
    if (AnalysisUtil[req.jsonObj.dataType][method]) {
        req.jsonObj.method = AnalysisUtil[req.jsonObj.dataType][method];
        next();
    } else {
        return next(new Error('No such analysis method "' + method + '" for data type "' + req.jsonObj.dataType + '"'));
    }
};

exports.getMethods = function(req, res) {
    var dataType = req.params.type;
    var dataTypes = Object.keys(AnalysisUtil);
    if (dataTypes.indexOf(dataType) > -1) {
        res.json(Object.keys(AnalysisUtil[dataType]));
    } else {
        res.status(500).json(new Error('No such data type "' + dataType + '"'));
    }
};

exports.analyze = function(req, res) {
    var analyzeMethod = req.jsonObj.method;
    var result = analyzeMethod(req.jsonObj.data);
    res.json(result);
};