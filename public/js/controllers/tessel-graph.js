/**
 * Created by derek on 2015/4/11.
 */
angular.module('app')
    .controller('tesselGraphController', function ($scope, $http, $location) {
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
                return d3.time.format("%c")(new Date(d));
            };
        };

        $scope.tesselData = [];
        $scope.velocityData = [];
        $scope.speedData = [];

        var initGraphData = function() {
            $scope.accelGraphData = [{
                key: 'x',
                values: []
            }, {
                key: 'y',
                values: []
            }, {
                key: 'z',
                values: []
            }];
            $scope.climateGraphData = [{
                key: 'degree',
                values: []
            }, {
                key: 'humidity',
                values: []
            }];
            $scope.velocityGraphData = [{
                key: 'horizontalVelocityX',
                values: []
            }, {
                key: 'horizontalVelocityY',
                values: []
            }];
            $scope.speedGraphData = [{
                key: 'horizontalSpeed',
                values: []
            }];
        };

        $scope.getTesselData = function() {
            $http({
                method: 'GET',
                //url: 'api/tessel/data'
                url: 'json/tessel/exp1.json'
            })
                .success(function (data, status, headers, config) {
                    $scope.tesselData.length = 0;
                    initGraphData();
                    $scope.tesselData = data;
                    $scope.accelGraphData.map(function(obj, index) {
                        $scope.tesselData.map(function(data) {
                            $scope.accelGraphData[index].values.push([Date.parse(data.time), data.accelerometerData[$scope.accelGraphData[index].key]]);
                        });
                    });
                    $scope.climateGraphData.map(function(obj, index) {
                        $scope.tesselData.map(function(data) {
                            $scope.climateGraphData[index].values.push([Date.parse(data.time), data.climateData[$scope.climateGraphData[index].key]]);
                        });
                    });
                    $scope.refreshCharts();

                    $location.path('/tessel-graph');
                });
        };

        $scope.getTesselAnalysisData = function() {
            $http({
                method: 'GET',
                url: 'api/tessel/analysis/exp1/accelerometer/analHorizontalVelocity'
            })
                .success(function (data, status, headers, config) {
                    $scope.velocityData.length = 0;
                    $scope.velocityData = data;
                    initGraphData();
                    $scope.velocityGraphData.map(function(obj, index) {
                        $scope.velocityData.map(function(data) {
                            $scope.velocityGraphData[index].values.push([Date.parse(data.time), data[$scope.velocityGraphData[index].key]]);
                        });
                    });
                    $scope.refreshCharts();

                    $location.path('/tessel-graph');
                });
        };

        $scope.getTesselSpeedData = function() {
            $http({
                method: 'GET',
                url: 'api/tessel/analysis/exp1/accelerometer/analHorizontalSpeed'
            })
                .success(function (data, status, headers, config) {
                    $scope.speedData.length = 0;
                    $scope.speedData = data;
                    initGraphData();
                    $scope.speedGraphData.map(function(obj, index) {
                        $scope.speedData.map(function(data) {
                            $scope.speedGraphData[index].values.push([Date.parse(data.time), data[$scope.speedGraphData[index].key]]);
                        });
                    });
                    $scope.refreshCharts();

                    $location.path('/tessel-graph');
                });
        };

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

        $scope.getTesselData();
        $scope.getTesselAnalysisData();
        $scope.getTesselSpeedData();
    });
