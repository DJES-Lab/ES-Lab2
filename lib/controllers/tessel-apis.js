/**
 * Created by derek on 2015/4/11.
 */
var Promise = require('bluebird'),
    DataUtil = require('../utils/tessel/dataUtil');

exports.data = function(req, res, next, id) {
    DataUtil.getDataById(id)
        .then(function(data) {
            req.data = data;
            next();
        })
        .catch(function(err) {
            if (err == 'not found') {
                return next(new Error('Failed to load data ' + id));
            } else {
                return next(err);
            }
        });
};

exports.get = function(req, res) {
    console.log("api/tessel/data received");
    DataUtil.getData(req)
        .then(function(dataObj) {
            res.header('Accept-Ranges', 'items');
            res.header('Range-Unit', 'items');
            res.header('Content-Range', dataObj.contentRange);

            if (dataObj.data.length) {
                res.json(dataObj.data);
            } else {
                console.log('No content');
                res.sendStatus(204);
            }
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
        .done();
};

exports.getAll = function(req, res) {
    console.log("api/tessel/data received");
    DataUtil.getAllData()
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
        .done();
};

exports.show = function(req, res) {
    res.json(req.data.allProperties());
};

exports.create = function(req, res) {
    DataUtil.createData(req)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
};

exports.update = function(req, res) {
    DataUtil.updateData(req)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
};

exports.destroy = function(req, res) {
    DataUtil.destroyData(req)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.status(500).json(err);
        });
};