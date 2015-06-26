//var constants = {baseUrl: "http://localhost:4000/"};
var constants = {baseUrl: "http://54.175.186.120:80/"};
var mainAppVar = angular.module('mainApp', ['ngRoute']);

// configure our routes
mainAppVar.config(function($routeProvider) {
  $routeProvider
  // route for the home page
    .when('/', {
    templateUrl: 'pages/search.html',
    controller: 'mainController'
  })

  // route for the about page
  .when('/result', {
    templateUrl: 'pages/searchResults.html',
    controller: 'resultController'
  });
});

mainAppVar.service('sharedProperties', function() {
    var symptom = '';
    return {
            getSymptom: function () {
                return symptom;
            },
            setSymptom: function(value) {
                symptom = value;
            }
        };
})

mainAppVar.controller('mainController', function($scope, sharedProperties) {
    $scope.fetchNewData=function() {
        sharedProperties.setSymptom($scope.symptom);
    };
});

mainAppVar.controller('resultController', function($scope, $http, sharedProperties) {
    $scope.symptomName=sharedProperties.getSymptom();
    $http.get(constants.baseUrl+"search?q="+sharedProperties.getSymptom())
    .success(function(response) {$scope.products = response;});
});
