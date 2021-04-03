var app = angular.module('myApp', ['customService']);
app.controller("personnelTrafficMonthlyReportCtrl", ["$scope", "$timeout", 'requests', function ($scope, $timeout, requests) {

    $scope.searchBtn = false;
    $scope.err = false;
    //============= date picker==================

    $timeout(function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }, 500)
    //=============== convert date to shamsi =============================
    $scope.convertToShamsi = function (date) {
        if (date != null) {
            return moment(date, 'YYYY/M/D').format('jYYYY/jMM/jDD');
        } else {
            return "-"
        }
    }
    //=============== convert date to miladi =============================
    $scope.convertToMiladi = function (date) {
        if (date != null) {
            return moment(date, 'jYYYY/jM/jD').format('YYYY-MM-DD');
        } else {
            return "-"
        }
    }
    //------------- load page -----------------------
    $scope.reportPages = function (page) {
        $scope.searchParameter = {
            firstName: null,
            lastName: null
        }
        var item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            fillNestedClass: true,
            searchList: [
            ]
        }
        if (page == 1) {
            if ($scope.report.item3 + 1 <= $scope.reports.totalPage) {
                item.pageNumber = $scope.reports.item3 + 1;
                $scope.getReportList(item);
            }
        } else if (page == -1) {
            if ($scope.reports.item3 - 1 > 0) {
                item.pageNumber = $scope.reports.item3 - 1;
                $scope.getReportList(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.getReportList(item);

        } else {
            item.pageNumber = $scope.reports.totalPage;
            $scope.getReportList(item);
        }
    }
    //-------------- search button -----------------------
    $scope.searching = function () {
        $scope.fromDate = $scope.convertToMiladi($('#fromDate').val())
        $scope.toDate = $scope.convertToMiladi($('#toDate').val());
        $scope.getReportList();
    }
    //------------- get list of work settings -----------------------
    $scope.getReportList = function (pageItem = null) {
        $scope.searchBtn = true;
        $scope.item = {
            fromTime: $scope.fromTime,
            toTime: $scope.toTime,
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            fillNestedClass: true,
            searchList: []
        }
        $scope.reports = [];
        if (pageItem == null) {
            requests.postingData(".../GetList", $scope.item, function (response) {
                $scope.reports = response.data;
                if ($scope.reports != null) {
                    $scope.reports.totalPage = Math.ceil($scope.reports.item2 / $scope.reports.item4)
                } else {
                    $scope.searchBtn = false;
                    $scope.err = true;
                }
            })
        } else {
            requests.postingData(".../GetList", pageItem, function (response) {
                $scope.reports = response.data;
                if ($scope.reports != null) {
                    $scope.reports.totalPage = Math.ceil($scope.reports.item2 / $scope.reports.item4)
                } else {
                    $scope.err = true;
                }
            })
        }
    }
}])