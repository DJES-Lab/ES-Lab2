/**
 * Created by derek on 2015/4/11.
 */
angular.module('app')
    .controller('tesselGraphController', function ($scope, $http, $location, ConvertJSON) {
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

        $scope.$watch('jsonFileProperties.selectedJSONFile', function(newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                $scope.getTesselData(newValue);
            }
        });

        $scope.$watch('jsonFileProperties.selectedDataType', function(newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                $scope.getAllAnalysisMethods(newValue);
                $scope.jsonFileProperties.selectedAnalysisMethod = 'Original Graph';
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
