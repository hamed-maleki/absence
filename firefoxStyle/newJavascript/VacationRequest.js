var app = angular.module('myApp', ['customService']);
app.controller('PersonnelVacationCtrl', ["$scope", "$timeout", 'requests', function ($scope, $timeout, requests) {

    //============= date picker==================

    $timeout(function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }, 500)

    //============ Get duration vacation in days by function ==========
    $scope.getVacationDays = function (dateFrom, DateTo) {
        var datefrom = new Date(dateFrom.toString().split('T')[0]);
        var dateto = new Date(DateTo.toString().split('T')[0]);
        let Diff_In_Time = dateto.getTime() - datefrom.getTime();
        let Diff_In_Days = Diff_In_Time / (1000 * 3600 * 24);
        return Diff_In_Days;
    }
    //============ Get data from server ======================
    $scope.GetPersonalVacationList = function (pageItem = null) {
        $scope.item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: []
        }
        $scope.vacation = [];
        if (pageItem == null) {
            requests.postingData("PersonLeave/GetList", $scope.item, function (response) {
                $scope.vacation = response.data;
                if ($scope.vacation != null) {
                    $scope.vacation.totalPage = Math.ceil($scope.vacation.item2 / $scope.vacation.item4)
                }
            })
        } else {
            requests.postingData("PersonLeave/GetList", pageItem, function (response) {
                $scope.vacation = response.data;
                if ($scope.vacation != null) {
                    $scope.vacation.totalPage = Math.ceil($scope.vacation.item2 / $scope.vacation.item4)
                }
            })
        }
    }
}])