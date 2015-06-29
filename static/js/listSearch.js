searchApp.controller('ListSearchController', function($scope, $http, ospConstants, $filter, $location, sharedProperties, $anchorScroll) {

    // function to create a date from moment date
    $scope.formatDate = function(date){
          var dateOut = new Date(date);
          return dateOut;
    };

    $scope.opts = {ranges: ospConstants.ranges};
    $scope.searchCriteria = sharedProperties.getGlobalSearchCriteria();
    $scope.availableRecall = [{name: 'Food', code: 'food'}, {name: 'Device', code: 'device'},{name: 'Drug', code: 'drug'}];
    $scope.searchCriteria.startDate = $filter('date')($scope.formatDate($scope.searchCriteria.startDate), 'MM/dd/yyyy');
    $scope.searchCriteria.endDate = $filter('date')($scope.formatDate($scope.searchCriteria.endDate), 'MM/dd/yyyy');
    $scope.availableStates = stateList;
    $scope.products = sharedProperties.getProductsList();
    
    // function to call the search service for selected search criteria
    $scope.searchData = function() {
        var recallType = $scope.searchCriteria.selectedRecall[0].code;
        var finalStateList = '';
        var keyTerm = $scope.searchCriteria.keyTerm;
        var from_date = $filter('date')($scope.formatDate($scope.searchCriteria.startDate), 'yyyy-MM-dd');
        var to_date = $filter('date')($scope.formatDate($scope.searchCriteria.endDate), 'yyyy-MM-dd');
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

    // function to create a date from format '20150827'
    $scope.createDate = function(dateString) {
        return new Date(dateString.slice(0,4), dateString.slice(4,6)-1, dateString.slice(6,8));
    }

    // function to redirect to recall details page
    $scope.showDetails = function (y) {
        sharedProperties.setRecallDetails(y);
        sharedProperties.setReloadData(false);
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

searchApp.controller('DetailsController', function($scope, sharedProperties, $location, $anchorScroll) {
    $scope.recallDetails = sharedProperties.getRecallDetails();
    $location.hash('page2');
    $anchorScroll();
});