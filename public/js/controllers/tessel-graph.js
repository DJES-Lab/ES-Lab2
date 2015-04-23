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
                        $scope.tesselData.map(function(data, dataIndex) {
                            $scope.accelGraphData[index].values.push([Date.parse(data.time)+dataIndex*10000, data.accelerometerData[$scope.accelGraphData[index].key]]);
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
    });
