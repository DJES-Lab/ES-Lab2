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

        $scope.jsonFileProperties = {
            selectedJSONFile: 'exp1',
            allJSONFileNames: [],
            selectedDataType: 'accelerometer',
            allDataTypes: [],
            selectedAnalysisMethod: 'Original Graph',
            allAnalysisMethods: []
        };

        $scope.getAllJSONFileNames = function() {
            $http.get('api/tessel/data/files')
                .success(function(data, status, headers, config) {
                    $scope.jsonFileProperties.allJSONFileNames = data;
                });
        };

        $scope.getAllAnalysisMethods = function(dataType) {
            console.log(dataType);
            $http.get('api/tessel/analysis/' + dataType + '/methods')
                .success(function (data, status, headers, config) {
                    $scope.jsonFileProperties.allAnalysisMethods = data;
                    $scope.jsonFileProperties.allAnalysisMethods.push('Original Graph');
                });
        };

        $scope.getTesselData = function(dataFileName) {
            $http.get('json/tessel/' + dataFileName + '.json')
                .success(function (data, status, headers, config) {
                    $scope.jsonFileProperties.allDataTypes = ConvertJSON.getAllDataTypes(data[0]);
                    $scope.tesselGraphData = {};
                    $scope.jsonFileProperties.allDataTypes.forEach(function (dataType) {
                        $scope.tesselGraphData[dataType] = ConvertJSON.convertToLineChartJSON(ConvertJSON.extractDataTypeFromAllData(data, dataType));
                    });

                    $scope.refreshCharts();

                    $location.path('/tessel-graph');
                });
        };

        $scope.getTesselAnalysisData = function(method) {
            var jsonFileName = $scope.jsonFileProperties.selectedJSONFile;
            var dataType = $scope.jsonFileProperties.selectedDataType;
            $http.get('api/tessel/analysis/' + jsonFileName + '/' + dataType + '/' + method)
                .success(function (data, status, headers, config) {
                    $scope.tesselGraphData[dataType] = ConvertJSON.convertToLineChartJSON(data);

                    $scope.refreshCharts();

                    $location.path('/tessel-graph');
                });
        };

        $scope.deleteTesselData = function(data) {
            $http.delete('api/tessel/data/' + data.id)
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

        $scope.$watch('jsonFileProperties.selectedAnalysisMethod', function(newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                if (newValue === 'Original Graph')
                    $scope.getTesselData($scope.jsonFileProperties.selectedJSONFile);
                else
                    $scope.getTesselAnalysisData(newValue);
            }
        });

        $scope.getTesselData($scope.jsonFileProperties.selectedJSONFile);
    });
