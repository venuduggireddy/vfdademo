'use strict';
var constants = {baseUrl: "http://localhost:80/"};
//var constants = {baseUrl: "http://54.175.186.120:80/"};
var searchApp = angular.module('searchApp', ['ngRoute', 'ngSanitize', 'ui.select', 'shalotelli-angular-multiselect', 'daterangepicker', '720kb.datepicker']);

searchApp.service('sharedProperties', function(ospConstants) {
    var recallDetails = '';
    var globalSearchCriteria = {states: [stateList[0]], selectedRecall: recallTypes,
                                startDate: ospConstants.minDateRange, 
                                endDate: ospConstants.maxDateRange,
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
    minDateRange:  moment().startOf('year').startOf('months').startOf('day'),
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

var recallTypes = [{name: 'Food', code: 'food'}, {name: 'Device', code: 'device'},{name: 'Drug', code: 'drug'}];

var stateList = [{name: 'Nationwide', code: 'NATIONWIDE'},
                {name: 'Alabama', code: 'AL'},
                {name: 'Alaska', code: 'AK'},
                {name: 'Arizona', code: 'AZ'},
                {name: 'Arkansas', code: 'AR'},
                {name: 'California', code: 'CA'},
                {name: 'Colorado', code: 'CO'},
                {name: 'Connecticut', code: 'CT'},
                {name: 'Washington DC', code: 'DC'},
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
