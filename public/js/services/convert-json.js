/**
 * Created by derek on 2015/4/23.
 */
angular.module('app')
    .factory('ConvertJSON', function() {
        var camelCaseToSentenceCase = function(camelString) {
            var tmp = camelString.replace(/([A-Z])/g, ' $1');
            return tmp.charAt(0).toUpperCase() + tmp.slice(1);
        };

        var genInitLineChartGraphData = function(obj) {
            if (typeof obj == 'object') {
                var keys = Object.keys(obj);
                if (keys.length > 1) {  // There is at least one key excluding 'time'
                    return keys
                        .filter(function(key) {
                            return key != 'time';
                        })
                        .map(function(key) {
                            return {
                                key: key,
                                values: []
                            };
                        });
                } else {
                    return [];
                }
            } else {
                return [];
            }
        };

        return {
            convertToLineChartJSON: function(arrObj) {
                if (arrObj.length == 0)
                    return [];
                else {
                    var initLineChartData = genInitLineChartGraphData(arrObj[0]);
                    initLineChartData.map(function(series) {
                        arrObj.map(function(obj) {
                            series.values.push([Date.parse(obj.time), obj[series.key]]);
                        });
                        series.key = camelCaseToSentenceCase(series.key);
                    });
                    return initLineChartData;
                }
            },

            extractDataTypeFromAllData: function(allData, dataType) {
                return allData.map(function(data) {
                    var dataTypeProperty = dataType.charAt(0).toLowerCase() + dataType.slice(1) + 'Data';
                    var dataObj = data[dataTypeProperty];
                    var dataObjKeys = Object.keys(dataObj);
                    var mappedObj = {
                        time: data.time
                    };
                    dataObjKeys.forEach(function(key) {
                        mappedObj[key] = data[dataTypeProperty][key];
                    });
                    return mappedObj;
                });
            },

            getAllDataTypes: function(obj) {
                if (typeof obj == 'object') {
                    var keys = Object.keys(obj);
                    if (keys.length) {
                        return keys
                            .filter(function(key) {
                                return key.match(/(.+)Data$/) && Object.keys(obj[key]).length > 0;
                            })
                            .map(function(key) {
                                return key.replace(/(.+)Data$/, '$1');
                            });
                    } else {
                        return [];
                    }
                } else {
                    return [];
                }
            }
        };
    });