searchApp.controller('MapSearchController', function($scope, $http, $filter, $location, sharedProperties, ospConstants) {

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

    $scope.searchData = function() {
        var from_date = $filter('date')($scope.formatDate($scope.searchCriteria.startDate), 'yyyy-MM-dd');
        var to_date = $filter('date')($scope.formatDate($scope.searchCriteria.endDate), 'yyyy-MM-dd');
        var recallType = '';
        for (var i = 0; i <= $scope.searchCriteria.selectedRecall.length - 1; i++) {
            if(i!=0) {
                recallType =  recallType + '&';
            }
            recallType =  recallType + 'product_type=' + $scope.searchCriteria.selectedRecall[i].code;
        };
        var keyTerm = $scope.searchCriteria.keyTerm;
        var dataAvailable = false;
        console.log(constants.baseUrl+"mapview?"+ recallType + "&key_term=" + keyTerm + "&daterange=["+from_date+ "+TO+"+to_date+"]");
        $http.get(constants.baseUrl+"mapview?"+ recallType + "&key_term=" + keyTerm + "&daterange=["+from_date+ "+TO+"+to_date+"]")
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
        $scope.nationalFoodNumbers = 0;
        $scope.nationalDrugNumbers = 0;
        $scope.nationalDeviceNumbers = 0;
        for(var i=0; i<stateList.length; i++) {
            $scope.currentRecordArray = $.grep($scope.products, function(e){ return e.state == stateList[i].code; });
            $scope.currentRecord = $scope.currentRecordArray[0];            
            if($scope.currentRecord  != null && $scope.currentRecord != undefined) {
                if($scope.currentRecord.state == 'NATIONWIDE') {
                    for(var j=0; j<$scope.currentRecord.value.length; j++) {
                        if($scope.currentRecord.value[j].type == 'food') {
                            $scope.nationalFoodNumbers = $scope.currentRecord.value[j].count;
                        } else if($scope.currentRecord.value[j].type == 'drug') {
                            $scope.nationalDrugNumbers = $scope.currentRecord.value[j].count;
                        } else if($scope.currentRecord.value[j].type == 'device') {
                            $scope.nationalDeviceNumbers = $scope.currentRecord.value[j].count;
                        }
                    }
                } else {
                    chart1[arrayIndex] =[stateList[i].name, $scope.currentRecord.total];
                    arrayIndex++;
                }
            } else {
                chart1[arrayIndex] =[stateList[i].name, 0];
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
                var result = $.grep(stateList, function(e){ return e.name == y; });
                $scope.searchCriteria.states = [{name: result[0].name, code:result[0].code}];
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
        var result = $.grep(stateList, function(e){ return e.code == y; });
        $scope.searchCriteria.states = [{name: y, code:y}];
        sharedProperties.setGlobalSearchCriteria($scope.searchCriteria);
        sharedProperties.setReloadData(true);
        $location.path('listSearch');
    };
    google.setOnLoadCallback($scope.drawDataMap());
    $scope.emptyFunction = function() {
        console.log('function');
    };
      $scope.searchData();
});