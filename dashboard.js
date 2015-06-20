var constants = {baseUrl: "http://localhost:4000/"};
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http, $location) {
    $scope.firstName= "John";
    $scope.lastName= "Doe";
    $scope.quantity=12;
    $scope.quality=3;
    $scope.person={firstName:'JFF',lastName:'AA'};
    $scope.points=[{quantity:1, quality:9}, {quantity:2, quality:3}];
    $scope.fetchNewData=function() { 
        $http.get(constants.baseUrl+"search?q="+$scope.symptom)
        .success(function(response) {$scope.products = response;});
    };
});