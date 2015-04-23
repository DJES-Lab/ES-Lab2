/**
 * Created by derek on 2015/4/23.
 */
var Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs'));


var jsonOutputPath = '/../../public/json/';

// File path is relative to 'public/json/'
exports.writeJSONFile = function(filePath, jsonObj) {
    return new Promise(function(resolve, reject) {
        fs.writeFileAsync(__dirname + jsonOutputPath + filePath, JSON.stringify(jsonObj))
            .then(resolve(jsonObj))
            .catch(reject);
    });
};