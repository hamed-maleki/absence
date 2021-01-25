var app = angular.module('myApp', ['customService']);
app.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: {
            onReadFile: "&"
        },
        link: function (scope, element, attrs) {
            element.on('change', function (e) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    scope.$apply(function () {
                        scope.onReadFile({ $content: e.target.result });
                    });
                };
                reader.readAsText((e.srcElement || e.target).files[0]);
            });
        }
    };
});
app.controller("customCtrl", ["$scope", "$http", "$timeout", 'requests', function ($scope, $http, $timeout, requests) {
    // console.log("this is happening")
    $scope.loadedHoliday = false;
    $scope.view = true;
    $scope.setChange = function (value) {
        $scope.view = value;
    }
    $scope.reset = true;
    $scope.clanderOptions = [
        {
            title: "تعطیلی این روز",
            id: 1
        }, {
            title: "تعطیلی این روز هفته",
            id: 2
        }
    ]
    $scope.clanderOptionsFill = [
        {
            title: "حذف این تعطیلی",
            id: 3
        },
        {
            title: "حذف این نوع تعطیلی ",
            id: 4
        }
    ]
    $scope.getMonthHoliday = function (month, year, type) {
        // console.log(year)
        var dataTosend = {
            pageNumber: 1,
            pageSize: 999,
            sortField: null,
            sortAsc: true,
            fillNestedClass: true,
            searchList: [
                {
                    searchValue: month.toString(),
                    searchField: "H.MonthId",
                    operatorType: 0,
                    operandType: 0
                }, {
                    searchValue: year.toString(),
                    searchField: "H.Year",
                    operatorType: 0,
                    operandType: 0
                }
            ]
        }
        requests.postingData("Holidays/GetList", dataTosend, function (response) {
            // $scope.getHolidayType();
            $scope.thisMonthHolidays = response.data;
            if (type == 1) {
                $scope.$broadcast("delete");
            }
            // console.log($scope.thisMonthHolidays)
            $scope.loadedHoliday = true;
            $scope.$broadcast("setHolidyForMonth")
        })
    }
    $scope.getYearHoliday = function (year, type) {
        $scope.currentYear = year;
        $scope.loadedHoliday = false;
        var dataTosend = {
            pageNumber: 1,
            pageSize: 999,
            sortField: null,
            sortAsc: true,
            fillNestedClass: true,
            searchList: [
                {
                    searchValue: year.toString(),
                    searchField: "H.Year",
                    operatorType: 0,
                    operandType: 0
                }
            ]
        }
        requests.postingData("Holidays/GetListCategory/" + year, dataTosend, function (response) {
            $scope.thisMonthHolidays = response.data;
            if (type == 1) {
                $scope.$broadcast("delete");
            }
            // console.log($scope.thisMonthHolidays)
            $scope.loadedHoliday = true;
            $scope.$broadcast("cancelImport");
        })
    }
    $scope.dayClick = function (data, type) {
        $scope.importPart = false;
        if (type == 1) {
            if (data.item == undefined || data.item == null) {
                if (data.month != null) {
                    $scope.dropdownStatus = false;
                    $scope.currentYear = data.year;
                    $scope.currentMonth = data.month
                    $scope.settingDate = data.year + "/" + data.month + "/" + data.date;
                    $("#defineHoliday").modal({ backdrop: 'static', keyboard: false });
                }
            } else {
                $scope.dropdownStatus = false;
                $scope.currentYear = data.year;
                $scope.currentMonth = data.month;
                $scope.editHolidayValue = data.item;
                $scope.dateInEditing = data;
                $scope.settingDate = data.year + "/" + data.month + "/" + data.date;
                $scope.editMode = false;
                $scope.deleteMode = false;
                $("#editHoliday").modal({ backdrop: 'static', keyboard: false });
            }
        } else if (type == 2) {
            if (data.month != null) {
                $scope.dropdownStatus = false;
                $scope.currentYear = data.year;
                $scope.currentMonth = data.month
                $scope.settingDate = data.year + "/" + data.month + "/" + data.date;
                $("#createDayOff").modal({ backdrop: 'static', keyboard: false });
                $timeout(function () {
                    $(".date-picker").datepicker({
                        dateFormat: "yy/mm/dd",
                        changeMonth: true,
                        changeYear: true
                    });
                }, 500)
            }

        } else if (type == 3) {
            $scope.dropdownStatus = false;
            $scope.currentYear = data.year;
            $scope.currentMonth = data.month;
            $scope.editHolidayValue = data.item
            // for (var i = 0; i < $scope.thisMonthHolidays.item1.length; i++) {
            //     if (data.year + "/" + data.month + "/" + data.date == moment($scope.thisMonthHolidays.item1[i].holidayDate, 'YYYY/M/D').format('jYYYY/jM/jD')) {
            //         $scope.editHolidayValue = $scope.thisMonthHolidays.item1[i];
            //         break;
            //     }
            // }
            $scope.dateInEditing = data;
            $scope.settingDate = data.year + "/" + data.month + "/" + data.date;
            $("#deleteConfirm").modal({ backdrop: 'static', keyboard: false });
        } else {
            $scope.generalTypeId = data.holidayTypeId;
            $("#deleteDayOff").modal();
            $("#generalStart").val(data.year + "/" + data.month + "/" + data.date)
            $timeout(function () {
                $(".date-picker").datepicker({
                    dateFormat: "yy/mm/dd",
                    changeMonth: true,
                    changeYear: true
                });
            }, 500)
        }
    }
    $scope.setImportDate = function (data) {
        $scope.importPart = true;
        $scope.dropdownStatus = false;
        $scope.currentYear = data.year;
        $scope.currentMonth = data.month
        $scope.settingDate = data.year + "/" + data.month + "/" + data.date;
        $("#defineHoliday").modal({ backdrop: 'static', keyboard: false });
    }
    $scope.deleteGeneral = function () {
        $timeout(function () {
            $(".date-picker").datepicker({
                dateFormat: "yy/mm/dd",
                changeMonth: true,
                changeYear: true
            });
        }, 500)
        $scope.generalTypeId = null;
        $("#deleteDayOff").modal();
    }
    $scope.confirmDeleteOffDay = function () {
        if ($scope.generalTypeId == null) {
            var itemToSend = {
                fromDate: moment($("#generalStart").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD'),
                toDate: moment($("#generalEnd").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD')
            }
        } else {
            var itemToSend = {
                fromDate: moment($("#generalStart").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD'),
                toDate: moment($("#generalEnd").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD'),
                holidayTypeId: $scope.generalTypeId
            }
        }
        requests.postingData("Holidays/DeleteRange", itemToSend, function (response) {
            $("#deleteDayOff").modal('hide');
            if ($scope.view) {
                $scope.getYearHoliday($scope.genralYear, 0)
            } else {
                $scope.getMonthHoliday($scope.generalMonth, $scope.genralYear, 0)
            }
        })
    }
    $scope.setGeneral = function (year, month) {
        $scope.genralYear = year;
        $scope.generalMonth = month;
    }
    $scope.cancelDeleteDayOff = function () {
        $("#deleteDayOff").modal("hide");
    }
    $scope.cancelDelete = function () {
        $("#deleteConfirm").modal("hide");
    }
    $scope.cancelEditHoliday = function () {
        $("#editHoliday").modal("hide");
    }
    $scope.confirmEdit = function () {
        requests.updating("Holidays/Update", $scope.editHolidayValue, function (response) {
            if ($scope.view) {
                $scope.getYearHoliday($scope.currentYear, 0)
            } else {
                $scope.getMonthHoliday($scope.currentMonth, $scope.currentYear, 0)
            }
            $("#editHoliday").modal("hide");
        })
    }
    $scope.confirmDelete = function () {
        requests.deleteing("Holidays/Delete/" + $scope.editHolidayValue.id, {}, function (response) {
            if ($scope.view) {
                $scope.getYearHoliday($scope.currentYear, 1)

            } else {
                $scope.getMonthHoliday($scope.currentMonth, $scope.currentYear, 1)
            }
            $("#editHoliday").modal("hide");
            $("#deleteConfirm").modal("hide");
        })
    }
    $scope.selectedType = {
        name: null
    }
    $scope.createHoliday = {
        name: null,
        holidayTypeId: null,
        holidayDate: null,
        year: null,
        monthId: null,
        description: null
    }
    $scope.cancelCustom = function () {
        $scope.dropdownStatus = false;
        $scope.selectedType.name = null;
        $scope.createHoliday = {
            name: null,
            holidayTypeId: null,
            holidayDate: null,
            year: null,
            monthId: null,
            description: null
        }
        $("#defineHoliday").modal('hide');
        if ($scope.view) {
            $scope.getYearHoliday($scope.currentYear, 0)
        } else {
            $scope.getMonthHoliday($scope.currentMonth, $scope.currentYear, 0)
        }
    }
    $scope.cancelCustom1 = function () {
        $scope.dropdownStatus = false;
        $scope.selectedType.name = null;
        $scope.createHoliday = {
            name: null,
            holidayTypeId: null,
            holidayDate: null,
            year: null,
            monthId: null,
            description: null
        }
        $("#defineHoliday").modal('hide');
    }
    $scope.cancelDayOff = function () {
        $scope.dropdownStatus = false;
        $scope.selectedType.name = null;
        $scope.createHoliday = {
            name: null,
            holidayTypeId: null,
            holidayDate: null,
            year: null,
            monthId: null,
            description: null
        }
        $("#createDayOff").modal("hide");
        if ($scope.view) {
            $scope.getYearHoliday($scope.currentYear, 0)
        } else {
            $scope.getMonthHoliday($scope.currentMonth, $scope.currentYear, 0)
        }
    }
    $scope.getHolidayType = function () {
        var item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            fillNestedClass: true,
            searchList: [

            ]
        }
        requests.postingData("HolidayTypes/GetList", item, function (response) {
            if (response.data.item1.length != 0) {
                $scope.hasValue = true;
                $scope.holidayTypes = response.data;
                $scope.holidayTypes.pagetotal = Math.ceil($scope.holidayTypes.item2 / $scope.holidayTypes.item4)
            } else {
                $scope.hasValue = false
            }
        })
    }
    $scope.confirmCreateType = function (item) {
        var itemToSend = {
            name: item.name
        }
        requests.postingData("HolidayTypes/Create", itemToSend, function (response) {
            $scope.getHolidayType();
        })
    }
    $scope.changeCreateModeType = function () {
        if ($scope.hasValue) {
            $scope.hasValue = false
        } else {
            $scope.hasValue = true
        }
    }
    $scope.setNameForCreate = function (data) {
        $scope.createHoliday.holidayTypeTitle = data.name;
        $scope.createHoliday.holidayTypeId = data.id;
        $scope.dropdownStatus = false;
    }
    $scope.setNameForEdit = function (data) {
        $scope.editHolidayValue.holidayTypeTitle = data.name;
        $scope.editHolidayValue.holidayTypeId = data.id;
        $scope.dropdownStatus = false;
    }

    $scope.editMode = false;
    $scope.deleteMode = false;
    $scope.months = [];
    $scope.confirmCustom = function () {

        $scope.createHoliday.year = $scope.currentYear;
        $scope.createHoliday.holidayDate = moment($scope.settingDate, 'jYYYY/jM/jD').format('YYYY-MM-DD');
        if (!$scope.importPart) {
            if ($scope.months.length == 0) {
                requests.postingData("Months/GetLookUp", {}, function (response) {
                    $scope.months = response.data
                    $scope.createHoliday.monthId = $scope.months[Number($scope.currentMonth) - 1].id
                    requests.postingData("Holidays/Create", $scope.createHoliday, function (response1) {
                        $scope.cancelCustom()
                    })
                })
            } else {
                $scope.createHoliday.monthId = $scope.months[Number($scope.currentMonth) - 1].id
                requests.postingData("Holidays/Create", $scope.createHoliday, function (response1) {
                    $scope.cancelCustom()
                })
            }
        } else {
            if ($scope.months.length == 0) {
                requests.postingData("Months/GetLookUp", {}, function (response) {
                    $scope.months = response.data;
                    $scope.createHoliday.monthId = $scope.months[Number($scope.currentMonth) - 1].id;
                    $scope.$broadcast('createConfirm');
                    $scope.cancelCustom1()
                })
            }else {
                $scope.createHoliday.monthId = $scope.months[Number($scope.currentMonth) - 1].id;
                $scope.$broadcast('createConfirm');
                $scope.cancelCustom1()
            }
        }
    }
    $scope.confirmCreateDayOff = function () {
        var dateToAdd = null;
        if ($("#endDayOff").val()) {
            dateToAdd = moment($("#endDayOff").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD')
        }
        var itemToSend = {
            startDate: moment($scope.settingDate, 'jYYYY/jM/jD').format('YYYY-MM-DD'),
            toDate: dateToAdd,
            holidayTypeId: $scope.createHoliday.holidayTypeId,
            nextDay: 7,
            name: $scope.createHoliday.name
        }
        requests.postingData("Holidays/CreateRange", itemToSend, function (response1) {
            $scope.cancelDayOff()
        })
    }
    $scope.exportFile = function () {
        var jsonToExport = JSON.stringify($scope.thisMonthHolidays);
        var blob = new Blob([jsonToExport], {
            type: "application/json"
        });
        saveAs(blob, 'holiday-export.json')
    }
    $scope.showContent = function (content) {
        $scope.thisMonthHolidays = JSON.parse(content);
        $scope.$broadcast("importHoliday");
    };
    $scope.cancelImport = function () {
        $scope.getYearHoliday($scope.currentYear, 0);
        $scope.$broadcast("cancelImport");
    }
    $scope.senImport = function(data,year) {
        
        requests.postingData("Holidays/CreateGroup/"+year,data,function(response){
            $scope.cancelImport();
        })
    }
}])