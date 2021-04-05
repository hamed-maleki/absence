var app = angular.module('myApp', ['customService', 'finance3']);
app.controller('personnelTrafficDailyReportCtrl', ["$scope", "$timeout", 'currencyConverter', 'requests', function ($scope, $timeout, currencyConverter, requests) {
    $scope.searchBtn = false;
    $scope.err = false;
    $scope.showSearch = false;
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
    //================== search and get personnel ===============================
    $scope.personnelInfoExist = false;
    $scope.moreThanOnePersonnel = false;
    $scope.IsPersonelRemoved = false;

    $scope.searchP = {
        value: null
    }

    $scope.selectMulti = true;
    $scope.openPersonnel = function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
        $("#addingPersonnelModal").modal();
        $scope.loadingPersonnel = true;
        $timeout(function () {
            currencyConverter.call()
        }, 100)
    }

    $scope.cancelAddingPersonnel = function () {
        $("#addingPersonnelModal").modal("hide");
        $scope.loadingPersonnel = false;
    }

    $('.dropdownInMission').on({
        "click": function (event) {
            if ($(event.target).closest('.dropdown-toggle').length) {
                $(this).data('closable', true);
            } else {
                $(this).data('closable', false);
            }
        },
        "hide.bs.dropdownInMission": function (event) {
            hide = $(this).data('closable');
            $(this).data('closable', true);
            return hide;
        }
    });

    $scope.selectPersonnel = function () {
        $scope.localPersonnel = false;
        $("#selectPersonnel").modal();
        $scope.loadingPersonnel = true;
        setTimeout(function () {
            currencyConverter.call()
        }, 500)
    }

    $scope.settingPersonnelInfo = function (data) {
        localStorage.setItem("lastSelected", JSON.stringify(data));
        $scope.oneSelected = true;
        $scope.loading = false;
        setTimeout(function () {
            $(".date-picker").datepicker({
                dateFormat: "yy/mm/dd",
                changeMonth: true,
                changeYear: true
            });
            $("#finishEnterDate").val(moment().format('jYYYY/jM/jD'))
            $("#startEnterDate").val(moment().add(-30, 'days').format('jYYYY/jM/jD'));

        }, 100);
    }

    $scope.selectPersonnelsFromDb = [];
    $scope.setPersonnel = function (data, method) {
        $scope.PersonnelIds = "";
        var dataLocal = localStorage.getItem("localPersonnelItem");
        if (dataLocal == null) {
            var itemToSet = [
                data
            ];
            localStorage.setItem("localPersonnelItem", JSON.stringify(itemToSet));
        } else {
            var flag = true;
            dataLocal = JSON.parse(dataLocal);
            for (var i = 0; i < dataLocal.length; i++) {
                if (data.Id == dataLocal[i].Id) {
                    flag = false;
                }
            }
            if (dataLocal.length > 2) {
                dataLocal.splice(2, 1);
            }
            if (flag) {
                dataLocal.unshift(data);
            }
            localStorage.setItem("localPersonnelItem", JSON.stringify(dataLocal));
        }

        $scope.loading = true;
        $scope.settingPersonnelInfo(data);
        if ($scope.IsPersonelRemoved == true) {
            $scope.selectPersonnelsFromDb = JSON.parse(localStorage.getItem('MultiSelectionPersonnel'));
            $scope.selectPersonnelsFromDb.push(data);
            localStorage.setItem('MultiSelectionPersonnel', JSON.stringify($scope.selectPersonnelsFromDb));
        } else {
            $scope.selectPersonnelsFromDb.push(data);
            localStorage.setItem('MultiSelectionPersonnel', JSON.stringify($scope.selectPersonnelsFromDb));
        }
        if (method == "1") {
            $scope.selectPersonnelFromDbArray = JSON.parse(localStorage.getItem('MultiSelectionPersonnel'));
            $scope.localPersonnel = false;
            for (let i = 0; i < $scope.selectPersonnelFromDbArray.length; i++) {
                $scope.PersonnelIds += $scope.selectPersonnelFromDbArray[i].Id.toString() + ",";
            }
            $scope.PersonnelIds = $scope.PersonnelIds.substring(00, $scope.PersonnelIds.length - 1);
            if ($scope.selectPersonnelFromDbArray.length != 0) {
                $scope.personnelInfoExist = true;
            }
            if ($scope.selectPersonnelFromDbArray.length > 1) {
                $scope.moreThanOnePersonnel = true;
            }
        }
    }
    $scope.confirmAddingPersonnel = function () {
        $scope.PersonnelIds = "";
        $scope.selectPersonnelFromDbArray = JSON.parse(localStorage.getItem('MultiSelectionPersonnel'));
        for (let i = 0; i < $scope.selectPersonnelFromDbArray.length; i++) {
            $scope.PersonnelIds += $scope.selectPersonnelFromDbArray[i].Id.toString() + ",";
        }
        if ($scope.selectPersonnelFromDbArray.length != 0) {
            $scope.personnelInfoExist = true;
        }
        if ($scope.selectPersonnelFromDbArray.length > 1) {
            $scope.moreThanOnePersonnel = true;
        }
        $scope.PersonnelIds = $scope.PersonnelIds.substring(0, $scope.PersonnelIds.length - 1);
        $("#selectPersonnel").modal('hide');
        $scope.showSearch = true;
    }

    $scope.checkLocal = function () {
        if (localStorage.getItem("lastSelected") != null) {
            var data = localStorage.getItem("lastSelected");
            data = JSON.parse(data)
            $scope.settingPersonnelInfo(data[0]);

        } else {

            $scope.getTableData('personnel');
            $scope.notLocal = true;
        }
    }

    $scope.RemovePersonnelFromDbArray = [];
    $scope.RemovePersonnelSelection = function (index) {
        $scope.RemovePersonnelFromDbArray = JSON.parse(localStorage.getItem('MultiSelectionPersonnel'));
        $scope.RemovePersonnelFromDbArray.splice(index, 1);
        localStorage.setItem('MultiSelectionPersonnel', JSON.stringify($scope.RemovePersonnelFromDbArray));
        $scope.confirmAddingPersonnel();
        $scope.IsPersonelRemoved = true;
        if ($scope.RemovePersonnelFromDbArray.length == 1) {
            $scope.moreThanOnePersonnel = false;
            $('#selectMissionType').val(0);
            $scope.GetDayMissionList();
            $scope.selectId = "";
            $scope.dayMission = [];
        }
    }
    $scope.checkMulti = function (id) {
        var found = false;
        for (var i = 0; i < $scope.selectPersonnelsFromDb.length; i++) {
            if ($scope.selectPersonnelsFromDb[i].Id == id) {
                found = true;
                break;
            }
        }
        return found;
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