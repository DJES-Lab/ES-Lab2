/**
 * Created by derek on 2015/4/11.
 */
angular.module('app')
    .controller('tesselGraphController', function ($scope, $http, $location) {
        $scope.tesselData = [];

        $scope.getTesselData = function() {
            $http({
                method: 'GET',
                url: 'api/tessel/data'
            })
                .success(function (data, status, headers, config) {
                    $scope.tesselData = data;
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
                    $scope.tesselData = _.without($scope.tesselData, data);
                    $scope.getTesselData();
                });
        };

        $scope.getTesselData();
    });
