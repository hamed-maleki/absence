var app = angular.module('myApp', ['finance3']);
app.controller('reportCtrl', function ($scope, $http, currencyConverter) {
    $scope.selectMulti = true;
    $scope.selectingMultiPle = false;
    $scope.changeSelectingStatus = function() {
        if($scope.selectingMultiPle) {
            $scope.selectingMultiPle = false;
        }else {
            $scope.selectingMultiPle = true;
        }
    }
    setTimeout(function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }, 100)
    $scope.getPersonnel = function(){
        $scope.loadingPersonnel = true;
        setTimeout(function () {
            currencyConverter.call()
        }, 500)
    }
})