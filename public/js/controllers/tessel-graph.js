/**
 * Created by derek on 2015/4/11.
 */
angular.module('app')
    .controller('tesselGraphController', function ($scope, $http, $location, ConvertJSON) {
        $scope.testData = [
            {
                title: 'Test',
                accelerometerData: {
                    x: 1, y:2, z: 3
                },
                climateData: {
                    degree: 2, humidity: 1.5
                },
                gpsData: {
                    lat: 4.124, lng: 5.252
                },
                time: new Date().toString()
            },
            {
                title: 'Test',
                accelerometerData: {
                    x: 1, y:2, z: 3
                },
                climateData: {
                    degree: 2, humidity: 1.5
                },
                gpsData: {
                    lat: 4.124, lng: 5.252
                },
                time: new Date().toString()
            },
            {
                title: 'Test',
                accelerometerData: {
                    x: 1, y:2, z: 3
                },
                climateData: {
                    degree: 2, humidity: 1.5
                },
                gpsData: {
                    lat: 4.124, lng: 5.252
                },
                time: new Date().toString()
            },
            {
                title: 'Test',
                accelerometerData: {
                    x: 1, y:2, z: 3
                },
                climateData: {
                    degree: 2, humidity: 1.5
                },
                gpsData: {
                    lat: 14.124, lng: 5.2521
                },
                time: new Date().toString()
            },
            {
                title: 'Test',
                accelerometerData: {
                    x: 1, y:2, z: 3
                },
                climateData: {
                    degree: 2, humidity: 1.55
                },
                gpsData: {
                    lat: 4.124, lng: 5.252222
                },
                time: new Date().toString()
            },
            {
                title: 'Test',
                accelerometerData: {
                    x: 1, y:2, z: 32
                },
                climateData: {
                    degree: 2, humidity: 1.5
                },
                gpsData: {
                    lat: 4.124, lng: 5.252
                },
                time: new Date().toString()
            },
            {
                title: 'Test',
                accelerometerData: {
                    x: 1, y:2, z: 3
                },
                climateData: {
                    degree: 2, humidity: 1.5
                },
                gpsData: {
                    lat: 11.124, lng: 5.252
                },
                time: new Date().toString()
            },
            {
                title: 'Test',
                accelerometerData: {
                    x: 1, y:2, z: 3
                },
                climateData: {
                    degree: 2, humidity: 1.5
                },
                gpsData: {
                    lat: 4.1224, lng: 5.252
                },
                time: new Date().toString()
            },
            {
                title: 'Test',
                accelerometerData: {
                    x: 1, y:2, z: 3
                },
                climateData: {
                    degree: 2, humidity: 1.5
                },
                gpsData: {
                    lat: 4.124, lng: 5.252
                },
                time: new Date().toString()
            },
            {
                title: 'Test',
                accelerometerData: {
                    x: 1, y:22, z: -3
                },
                climateData: {
                    degree: 23, humidity: 1.225
                },
                gpsData: {
                    lat: 4.124, lng: 5.2522
                },
                time: new Date().toString()
            },
            {
                title: 'Test',
                accelerometerData: {
                    x: 11, y:-2, z: 3.2
                },
                climateData: {
                    degree: 23, humidity: 1.15
                },
                gpsData: {
                    lat: 1.234, lng: 3.22
                },
                time: new Date().toString()
            }
        ];

        $scope.postTestData = function() {
            $http.post('api/tessel/data/arr', $scope.testData)
                .success(function (data, status) {
                    console.log(data);
                    $scope.getTesselData();
                });
        };

        $scope.refreshCharts = function () {
            for (var i = 0; i < nv.graphs.length; i++) {
                nv.graphs[i].update();
            }
        };

        $scope.xAxisTickFormatFunction = function() {
            return function(d) {
                return d3.time.format("%X")(new Date(d));
            };
        };

        $scope.tesselData = [];
        $scope.velocityData = [];
        $scope.speedData = [];
        $scope.jsonFileProperties = {
            selectedJSONFile: 'exp1',
            allJSONFileNames: [],
            selectedDataType: 'accelerometer',
            allDataTypes: [],
            selectedAnalysisMethod: '',
            allAnalysisMethods: []
        };

        $scope.getAllJSONFileNames = function() {
            $http({
                method: 'GET',
                url: 'api/tessel/data/files'
            })
                .success(function(data, status, headers, config) {
                    $scope.jsonFileProperties.allJSONFileNames = data;
                });
        };

        $scope.getAllAnalysisMethods = function(dataType) {
            var dataTypeParam = dataType.charAt(0).toLowerCase() + dataType.slice(1);
            $http({
                method: 'GET',
                url: 'api/tessel/analysis/' + dataTypeParam + '/methods'
            })
                .success(function (data, status, headers, config) {
                    $scope.jsonFileProperties.allAnalysisMethods[dataTypeParam] = data;
                });
        };

        $scope.getTesselData = function(dataFileName) {
            $http({
                method: 'GET',
                url: 'json/tessel/' + dataFileName + '.json'
            })
                .success(function (data, status, headers, config) {
                    $scope.tesselData = data;
                    $scope.jsonFileProperties.allDataTypes = ConvertJSON.getAllDataTypes(data[0]);
                    $scope.tesselGraphData = {};
                    $scope.jsonFileProperties.allDataTypes.forEach(function(dataType) {
                        $scope.tesselGraphData[dataType] = ConvertJSON.convertToLineChartJSON(ConvertJSON.extractDataTypeFromAllData(data, dataType));
                        $scope.getAllAnalysisMethods(dataType);  // This is async!
                    });

                    $scope.refreshCharts();

                    $location.path('/tessel-graph');
                });
        };

        $scope.getTesselAnalysisData = function(method) {
            var jsonFileName = $scope.jsonFileProperties.selectedJSONFile;
            var dataType = $scope.jsonFileProperties.selectedDataType.charAt(0).toLowerCase() + $scope.jsonFileProperties.selectedDataType.slice(1);
            $http({
                method: 'GET',
                url: 'api/tessel/analysis/' + jsonFileName + '/' + dataType + '/' + method
            })
                .success(function (data, status, headers, config) {
                    $scope.tesselData = data;
                    $scope.tesselGraphData[dataType] = ConvertJSON.convertToLineChartJSON(data);

                    $scope.refreshCharts();

                    $location.path('/tessel-graph');
                });
        };

        //$scope.getTesselData = function() {
        //    $http({
        //        method: 'GET',
        //        //url: 'api/tessel/data'
        //        url: 'json/tessel/exp1.json'
        //    })
        //        .success(function (data, status, headers, config) {
        //            $scope.tesselData = data;
        //            $scope.accelGraphData = ConvertJSON.convertToLineChartJSON(data.map(function(dat) {
        //                return {
        //                    time: dat.time,
        //                    x: dat.accelerometerData.x,
        //                    y: dat.accelerometerData.y,
        //                    z: dat.accelerometerData.z
        //                };
        //            }));
        //            $scope.climateGraphData = ConvertJSON.convertToLineChartJSON(data.map(function(dat) {
        //                return {
        //                    time: dat.time,
        //                    degree: dat.climateData.degree,
        //                    humidity: dat.climateData.humidity
        //                };
        //            }));
        //            $scope.refreshCharts();
        //
        //            $location.path('/tessel-graph');
        //        });
        //};

        //$scope.getTesselAnalysisData = function() {
        //    $http({
        //        method: 'GET',
        //        url: 'api/tessel/analysis/exp1/accelerometer/analHorizontalVelocity'
        //    })
        //        .success(function (data, status, headers, config) {
        //            $scope.velocityData = data;
        //            $scope.velocityGraphData = ConvertJSON.convertToLineChartJSON(data);
        //
        //            $scope.refreshCharts();
        //
        //            $location.path('/tessel-graph');
        //        });
        //};
        //
        //$scope.getTesselSpeedData = function() {
        //    $http({
        //        method: 'GET',
        //        url: 'api/tessel/analysis/exp1/accelerometer/analHorizontalSpeed'
        //    })
        //        .success(function (data, status, headers, config) {
        //            $scope.speedData = data;
        //            $scope.speedGraphData = ConvertJSON.convertToLineChartJSON(data);
        //            $scope.refreshCharts();
        //
        //            $location.path('/tessel-graph');
        //        });
        //};

        $scope.deleteTesselData = function(data) {
            $http({
                method: 'DELETE',
                url: 'api/tessel/data/' + data.id
            })
                .success(function (data, status, headers, config) {
                    $location.path('/tessel-graph');
                    $scope.getTesselData();
                });
        };

        $scope.$watch('jsonFileProperties.selectedJSONFile', function(newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                $scope.getTesselData(newValue);
            }
        });

        $scope.getTesselData($scope.jsonFileProperties.selectedJSONFile);
        //$scope.getTesselAnalysisData();
        //$scope.getTesselSpeedData();
    });
