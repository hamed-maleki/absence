var app = angular.module('myApp', ['customService','finance3']);
app.controller('groupEnteranceCtrl', function ($scope, $http, currencyConverter,requests) {
    $scope.selectPersonnel = function () {
        $scope.selectMulti = true;
        $scope.localPersonnel = false;
        $scope.loadingPersonnel = true;
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
        $('.time').wickedpicker({
            twentyFour: true,
            upArrow: 'fa fa-chevron-up',
            downArrow: 'fa fa-chevron-down'
        });
        setTimeout(function () {
            currencyConverter.call()
        }, 500)
    }
})