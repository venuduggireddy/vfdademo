'use strict';
var constants = {baseUrl: "http://localhost:80/"};
//var constants = {baseUrl: "http://54.175.186.120:80/"};
var searchApp = angular.module('searchApp', ['ngRoute', 'ngSanitize', 'ui.select','daterangepicker']);

searchApp.service('sharedProperties', function(ospConstants) {
    var recallDetails = '';
    var globalSearchCriteria = {states: [stateList[0]], recallType: recallTypes[1],
                                dateRange: {startDate: ospConstants.minDateRange, endDate: ospConstants.maxDateRange},
                                keyTerm: ''};
    var productsList = {};
    var reloadData = true;
    return {
            getRecallDetails: function () {
                return recallDetails;
            },
            setRecallDetails: function(value) {
                recallDetails = value;
            },
            getGlobalSearchCriteria: function () {
            return globalSearchCriteria;
            },
            setGlobalSearchCriteria: function(value) {
                globalSearchCriteria = value;
            },
            getProductsList: function () {
            return productsList;
            },
            setProductsList: function(value) {
                productsList = value;
            },
            getReloadData: function() {
                return reloadData;
            },
            setReloadData: function(value) {
                reloadData = value;
            }
    };
})

// configure our routes
searchApp.config(function($routeProvider) {
  $routeProvider
  // route for the list search page
    .when('/', {
    templateUrl: '/pages/mapSearch.html',
    controller: 'MapSearchController'
  })

  // route for map search page
  .when('/listSearch', {
    templateUrl: '../pages/listSearch.html',
    controller: 'ListSearchController'
  })

  // route for the details page
  .when('/detailsPage', {
    templateUrl: '../pages/detailsPage.html',
    controller: 'DetailsController'
  })
});

searchApp.value("ospConstants", {
    minDateRange:  moment().subtract(30,'days'),
    maxDateRange: moment().subtract(1,'days'),
    ranges:{
        'Last 30 Days': [moment().subtract(30,'days'), moment().subtract(1,'days')],
        'This Month':[moment().startOf('month').startOf('day'),moment().subtract(1,'days')],
        'Last Month': [moment().subtract(1,'months').startOf('month'), moment().subtract(1,'months').endOf('month')],
        'Year to Date': [moment().startOf('year').startOf('months').startOf('day'),moment().subtract(1,'days')]
    }
});

/**
 * AngularJS default filter with the following expression:
 * "recall in availableRecall | filter: {name: $select.search}"
 */
searchApp.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});

searchApp.controller('ListSearchController', function($scope, $http, ospConstants, $filter, $location, sharedProperties, $anchorScroll) {

    $scope.opts = {ranges: ospConstants.ranges};
    $scope.searchCriteria = sharedProperties.getGlobalSearchCriteria();
    $scope.availableRecall = recallTypes;
    $scope.availableStates = stateList;
    $scope.products = sharedProperties.getProductsList();
    // function to call the search service for selected search criteria
    $scope.searchData = function() {
        var recallType = $scope.searchCriteria.recallType.code;
        var finalStateList = '';
        var keyTerm = $scope.searchCriteria.keyTerm;
        var from_date = $filter('date')($scope.formatDate($scope.searchCriteria.dateRange.startDate), 'yyyy-MM-dd');
        var to_date = $filter('date')($scope.formatDate($scope.searchCriteria.dateRange.endDate), 'yyyy-MM-dd');
        for (var i = 0; i <= $scope.searchCriteria.states.length - 1; i++) {
            finalStateList =  finalStateList + '&locations=' + $scope.searchCriteria.states[i].code;
        };
        console.log(constants.baseUrl+"recallInfo?product_type="+ recallType + finalStateList + "&key_term=" + keyTerm + "&daterange=["+from_date+ "+TO+"+to_date+"]");
        $http.get(constants.baseUrl+"recallInfo?product_type="+ recallType + finalStateList + "&key_term=" + keyTerm + "&daterange=["+from_date+ "+TO+"+to_date+"]")
            .success(function(response) {
                $scope.products = response;
                sharedProperties.setProductsList($scope.products);
            });
        sharedProperties.setGlobalSearchCriteria($scope.searchCriteria);
    };

    // function to create a date from moment date
    $scope.formatDate = function(date){
          var dateOut = new Date(date);
          return dateOut;
    };

    // function to create a date from format '20150827'
    $scope.createDate = function(dateString) {
        return new Date(dateString.slice(0,4), dateString.slice(4,6)-1, dateString.slice(6,8));
    }

    // function to redirect to recall details page
    $scope.showDetails = function (y, path) {
        sharedProperties.setRecallDetails(y);
        sharedProperties.setReloadData(false);
        $location.path(path);
    };
    $scope.recallDetails = sharedProperties.getRecallDetails();
    if($scope.recallDetails.event_details!=null) {
        $location.hash($scope.recallDetails.event_details.event_id);
        $anchorScroll();
    } 
    if(sharedProperties.getReloadData() == true) {
        sharedProperties.setReloadData(false);
        $scope.searchData();
    }
   
});

searchApp.controller('MapSearchController', function($scope, $http, $filter, $location, sharedProperties, ospConstants) {

    $scope.opts = {ranges: ospConstants.ranges};
    $scope.searchCriteria = sharedProperties.getGlobalSearchCriteria();
    $scope.availableRecall = recallTypes;
    $scope.availableStates = stateList;
    $scope.products = sharedProperties.getProductsList();


    // function to create a date from moment date
    $scope.formatDate = function(date){
          var dateOut = new Date(date);
          return dateOut;
    };
    
    $scope.searchData = function() {
        var from_date = $filter('date')($scope.formatDate($scope.searchCriteria.dateRange.startDate), 'yyyy-MM-dd');
        var to_date = $filter('date')($scope.formatDate($scope.searchCriteria.dateRange.endDate), 'yyyy-MM-dd');

        var recallType = $scope.searchCriteria.recallType.code;
        var keyTerm = $scope.searchCriteria.keyTerm;
        var from_date = $filter('date')($scope.formatDate($scope.searchCriteria.dateRange.startDate), 'yyyy-MM-dd');
        var to_date = $filter('date')($scope.formatDate($scope.searchCriteria.dateRange.endDate), 'yyyy-MM-dd');
        
        var dataAvailable = false;
        console.log(constants.baseUrl+"recallmapview?product_type="+ recallType + "&key_term=" + keyTerm + "&daterange=["+from_date+ "+TO+"+to_date+"]");
        $http.get(constants.baseUrl+"recallmapview?product_type="+ recallType + "&key_term=" + keyTerm + "&daterange=["+from_date+ "+TO+"+to_date+"]")
             .success(function(response) {
               $scope.products = response;
               sharedProperties.setGlobalSearchCriteria($scope.searchCriteria);
               sharedProperties.setReloadData(true);
               $scope.populateData();
               $scope.drawDataMap();
            });
     }
    var chart1 = [];
    $scope.populateData = function() {
        chart1[0] = ['State', 'Total Recall'];
        var arrayIndex = 1;
        for(var i=1; i<$scope.products.length; i++) {
            if($scope.products[i].state == 'NATIONWIDE' || $scope.products[i].state == 'Nationwide' || $scope.products[i].state == 'nationwide') {
                $scope.nationalNumbers = $scope.products[i].value.count;
            } else {
                chart1[arrayIndex] =[$scope.products[i].state, $scope.products[i].value.count];
                arrayIndex++;
            }
        }
        if($scope.nationalNumbers == undefined) {
            $scope.nationalNumbers = 0;
        }
        
    };
    $scope.drawDataMap = function() {
        var data = google.visualization.arrayToDataTable(chart1);
        var options = {
            keepAspectRatio: true,
            width:100 + "%",
            height:100 + '%',
            colorAxis: {colors: ['#aec7e8', '#1f77b4']},
            //colorAxis: {colors: ['#DDEACC', '#109618']},
            region: "US",
            resolution: "provinces",
            sizeAxis: {minValue: 1, maxValue:1,minSize:10,  maxSize: 10}
        };

        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

        chart.draw(data, options);

        google.visualization.events.addListener(chart, 'select', function() {
        var selectedItem = chart.getSelection()[0];
            if (selectedItem) {
                var y = data.getValue(selectedItem.row,0);
                $scope.searchCriteria.states = [{name: y, code:y}];
                sharedProperties.setGlobalSearchCriteria($scope.searchCriteria);
                sharedProperties.setReloadData(true);
                $location.path('listSearch');
                $scope.$apply();
            }
        });

        go();

        window.addEventListener('resize', go);
        function go(){
            chart.draw(data, options);
        }
        
      };

    // function to redirect to recall details page
    $scope.showDetails = function (y) {
        $scope.searchCriteria.states = [{name: y, code:y}];
        sharedProperties.setGlobalSearchCriteria($scope.searchCriteria);
        sharedProperties.setReloadData(true);
        $location.path('listSearch');
    };

      google.setOnLoadCallback($scope.drawDataMap());
      $scope.searchData();
});

searchApp.controller('DetailsController', function($scope, sharedProperties, $location, $anchorScroll) {
    $scope.recallDetails = sharedProperties.getRecallDetails();
    $location.hash('page2');
    $anchorScroll();
});
var recallTypes = [{name: 'Drug', code: 'drug'},
                {name: 'Food', code: 'food'},
                {name: 'Device', code: 'device'}];

var stateList = [{name: 'Nationwide', code: 'Nationwide'},
                {name: 'Alabama', code: 'AL'},
                {name: 'Alaska', code: 'AK'},
                {name: 'Arizona', code: 'AZ'},
                {name: 'Arkansas', code: 'AR'},
                {name: 'California', code: 'CA'},
                {name: 'Colorado', code: 'CO'},
                {name: 'Connecticut', code: 'CT'},
                {name: 'Delaware', code: 'DE'},
                {name: 'Florida', code: 'FL'},
                {name: 'Georgia', code: 'GA'},
                {name: 'Hawaii', code: 'HI'},
                {name: 'Idaho', code: 'ID'},
                {name: 'Illinois', code: 'IL'},
                {name: 'Indiana', code: 'IN'},
                {name: 'Iowa', code: 'IA'},
                {name: 'Kansas', code: 'KS'},
                {name: 'Kentucky', code: 'KY'},
                {name: 'Louisiana', code: 'LA'},
                {name: 'Maine', code: 'ME'},
                {name: 'Maryland', code: 'MD'},
                {name: 'Massachusetts', code: 'MA'},
                {name: 'Michigan', code: 'MI'},
                {name: 'Minnesota', code: 'MN'},
                {name: 'Mississippi', code: 'MS'},
                {name: 'Missouri', code: 'MO'},
                {name: 'Montana', code: 'MT'},
                {name: 'Nebraska', code: 'NE'},
                {name: 'Nevada', code: 'NV'},
                {name: 'New Hampshire', code: 'NH'},
                {name: 'New Jersey', code: 'NJ'},
                {name: 'New Mexico', code: 'NM'},
                {name: 'New York', code: 'NY'},
                {name: 'North Carolina', code: 'NC'},
                {name: 'North Dakota', code: 'ND'},
                {name: 'Ohio', code: 'OH'},
                {name: 'Oklahoma', code: 'OK'},
                {name: 'Oregon', code: 'OR'},
                {name: 'Pennsylvania', code: 'PA'},
                {name: 'Rhode Island', code: 'RI'},
                {name: 'South Carolina', code: 'SC'},
                {name: 'South Dakota', code: 'SD'},
                {name: 'Tennessee', code: 'TN'},
                {name: 'Texas', code: 'TX'},
                {name: 'Utah', code: 'UT'},
                {name: 'Vermont', code: 'VT'},
                {name: 'Virginia', code: 'VA'},
                {name: 'Washington', code: 'WA'},
                {name: 'West Virginia', code: 'WV'},
                {name: 'Wisconsin', code: 'WI'},
                {name: 'Wyoming', code: 'WY'}];
