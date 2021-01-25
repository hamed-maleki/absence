var app = angular.module('myApp', ['customService', 'finance3']);

app.controller("holidayCtrl", ["$scope", "$http", "$timeout", 'requests', function ($scope, $http, $timeout, requests) {
    // console.log("this is happening");
    // console.log(localStorage.getItem("jwtToken"))
    $scope.setGeneral = function () {

    }
    $timeout(function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }, 500)
    $scope.path = "https://localhost:44302/"
    $scope.authHeaders = {};
    $scope.accesstoken = localStorage.getItem('jwtToken');
    $scope.refreshtoken = localStorage.getItem('refreshToken');
    if ($scope.accesstoken) {
        $scope.authHeaders.Authorization = 'Bearer ' + $scope.accesstoken;
    }
    $scope.getShifList = function () {
        $scope.dataToGetShifts = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: [
            ]
        }
        requests.postingData("Shifts/GetList", $scope.dataToGetShifts, function (response) {
            $scope.shifArray = response.data;
            $scope.shifArray.pagetotal = Math.ceil($scope.shifArray.item2 / $scope.shifArray.item4)
        })

    }
    $scope.getShiftTable = function (item) {
        requests.postingData("Shifts/GetList", item, function (response) {
            $scope.shifArray = response.data;
            $scope.shifArray.pagetotal = Math.ceil($scope.shifArray.item2 / $scope.shifArray.item4)
        })
    }
    $scope.loadPagesShift = function (page) {
        // console.log(page);
        $scope.searchParameter = {
            firstName: null,
            lastName: null
        }
        var item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: [
            ]
        }
        if (page == 1) {
            if ($scope.shifArray.item3 + 1 <= $scope.shifArray.pagetotal) {
                item.pageNumber = $scope.shifArray.item3 + 1;
                $scope.getShiftTable(item);
            }
        } else if (page == -1) {
            if ($scope.shifArray.item3 - 1 > 0) {
                item.pageNumber = $scope.shifArray.item3 - 1;
                $scope.getShiftTable(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.getShiftTable(item);

        } else {
            item.pageNumber = $scope.shifArray.pagetotal;
            $scope.getShiftTable(item);
        }
    }
    $scope.createHoliday = {
        name: null,
        holidayTypeId: null,
        holidayDate: null,
        year: null,
        monthId: null,
        description: null
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
    $scope.cancelCustomAdding = function () {
        $scope.dropdownStatus = false;
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
    $scope.months = [];
    $scope.setImportDate = function (data) {
        $scope.importPart = true;
        $scope.dropdownStatus = false;
        $scope.createHoliday.year = data.year;
        $scope.currentMonth = data.month;
        $scope.createHoliday.holidayDate = moment(data.year + "/" + data.month + "/" + data.date, 'jYYYY/jM/jD').format('YYYY-MM-DD');;
        $("#defineHoliday").modal({ backdrop: 'static', keyboard: false });
    }
    $scope.confirmCustomAdding = function () {
        $scope.createHoliday.monthId = Number($scope.currentMonth)
        $scope.$broadcast('createConfirm');
        $scope.cancelCustomAdding()
    }
    $scope.setNameForCreate = function (data) {
        $scope.createHoliday.holidayTypeTitle = data.name;
        $scope.createHoliday.holidayTypeId = data.id;
        $scope.dropdownStatus = false;
    }
    $scope.changeCreateMode = function () {
        $scope.loadingCalendar = false;
        $scope.createData = {
            allowedDelayAddToShortageHour: false,
            allowedDelayMin: null,
            startDate: null,
            endDate: null,
            allowedHurryAddToShortageHour: false,
            allowedHurryMin: null,
            extraHourRate: null,
            hasExtraAfter: false,
            hasExtraBefore: false,
            isActive: false,
            isExtraWork: false,
            maxTimeAfter: null,
            maxTimeBefore: null,
            minTimeAfter: null,
            minTimeBefore: null,
            name: null,
            description: null,
            moveHourAfter: 0,
            shiftTypeId: null
        }
        $("#startDate").val('')
        $("#endDate").val('')
        $("#createModal").modal();

    }
    $scope.changeEditView = function (data) {
        if ($scope.createMode) {
            $scope.createMode = false
        } else {
            requests.gettingData("ShiftDetails/GetListByShiftId/" + data.id, function (response) {
                // console.log(response);
                $scope.createMode = true;
                $scope.editingInfo = data;

            })
        }
    }
    $scope.cancelCreate = function () {
        $scope.createData = {}
        $("#createModal").modal('hide');
    }
    $scope.confirmCreate = function (data, condition) {
        $scope.createData.startDate = moment($("#startDate").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD')
        if ($("#endDate").val() != '') {

            $scope.createData.endDate = moment($("#endDate").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD');
        } else {
            $scope.createData.endDate = null;
        }
        requests.postingData("Shifts/Create", $scope.createData, function (response) {
            if (condition == 1) {
                $("#createModal").modal('hide');
                $scope.getShifList();
            } else if (condition == 2) {
                $scope.loadingCalendar = true;
                $scope.calendarSettingInfoId = response.data;
            }
        })
    }
    $scope.changeDate = function (date) {
        if (date != null) {
            return moment(date, 'YYYY/M/D').format('jYYYY/jMM/jDD');
        } else {
            return "-"
        }
    }
    $scope.changeDate1 = function (date) {
        if (date != null) {
            return moment(date, 'jYYYY/jM/jD').format('YYYY-MM-DD');
        } else {
            return "-"
        }
    }
    $scope.deleteRow = function (data) {
        $scope.deletingData = data.id
        $("#deleteConfirm").modal();
    }
    $scope.cancelDelete = function () {
        $("#deleteConfirm").modal('hide');
    }
    $scope.confirmDelete = function () {
        requests.deleteing("Shifts/Delete/" + $scope.deletingData, {}, function (response) {
            $("#deleteConfirm").modal('hide');
            $scope.getShifList();
        })
    }
    $scope.setLawOffDay = function (data) {
        $scope.addingLawData = data;
        if (data.law == undefined || data.law.rate == null) {
            $scope.customRate = null;
        } else {
            $scope.customRate = data.law.rate;
        }
        $("#offDayLawModal").modal();
    }
    $scope.cancelHolidayOffLaw = function () {
        $("#offDayLawModal").modal('hide');
    }
    $scope.confirmDayOffLaw = function () {
        // console.log($scope.customRate)
        $scope.addingLawData.law = {
            rate: null
        }
        if ($scope.customRate != null) {
            $scope.addingLawData.law.rate = $scope.customRate;
        } else {
            $scope.addingLawData.law = null;
        }
        $scope.$broadcast("addLawToHoliday");
        $("#offDayLawModal").modal('hide');
    }
    $scope.setlawOpenDay = function (data) {
        $scope.addingLawData = data;
        if (data.law != undefined) {
            $scope.preSetLawItem = data.law;
        } else {
            $scope.preSetLawItem = {
                moveMinOnStart: null,
                moveMinOnEnd: null,
                isExtraWork: false,
                hasExtraBeforeStart: null,
                hasExtraAfterEnd: null,
                minTimeBeforeStart: null,
                maxTimeBeforeStart: null,
                minTimeAfterEnd: null,
                maxTimeAfterEnd: null,
                extraHourRate: null
            }
        }
        $("#openDayLawModal").modal()
    }
    $scope.cacnelOpenDayLaw = function () {
        $("#openDayLawModal").modal('hide')
    }
    $scope.lawsDays = [];
    $scope.confirmOpenDayLaw = function () {
        // console.log($scope.preSetLawItem);
        if ($scope.addingLawData.law == undefined) {
            $scope.lawsDays.push($scope.addingLawData);
        }
        $scope.addingLawData.law = $scope.preSetLawItem;
        $("#openDayLawModal").modal('hide')
    }
    $scope.resetOpenDayLaw = function (day) {
        day.law = undefined;
        for (var i = 0; i < $scope.lawsDays.length; i++) {
            if (day.date == $scope.lawsDays[i].date && day.month == $scope.lawsDays[i].month && day.year == $scope.lawsDays[i].year) {
                $scope.lawsDays.splice(i, 1);
                $("#openDayLawModal").modal('hide')
                break;
            }
        }
    }
    $scope.senImport = function (holidayItem, year) {
        var itemToSend = [];

        for (var i = 0; i < holidayItem.length; i++) {
            var itemToAdd = {
                shiftId: $scope.calendarSettingInfoId,
                isOff: true,
                holidayTypeId: null,
                holidayTypeTitle: null,
                holidaysId: null,
                holidaysName: holidayItem[i].name,
            }
            if (holidayItem[i].law != undefined) {
                itemToAdd.extraHourRate = holidayItem[i].law.rate;
            }
            if (holidayItem[i].id != undefined) {
                itemToAdd.holidaysId = holidayItem[i].id
            } else {
                itemToAdd.specialDayDate = holidayItem[i].holidayDate
            }
            itemToSend.push(itemToAdd)
        }
        for (var i = 0; i < $scope.lawsDays.length; i++) {
            console.log($scope.lawsDays[i])
            var itemToAdd = {
                shiftId: $scope.calendarSettingInfoId,
                isOff: false,
                isExtraWork: null,
                specialDayDate: moment($scope.lawsDays[i].year + "/" + $scope.lawsDays[i].month + "/" + $scope.lawsDays[i].date, 'jYYYY/jM/jD').format('YYYY-MM-DD'),
                hasExtraBeforeStart: $scope.lawsDays[i].law.hasExtraBeforeStart,
                hasExtraAfterEnd: $scope.lawsDays[i].law.hasExtraAfterEnd,
                minTimeBeforeStart: $scope.lawsDays[i].law.minTimeBeforeStart,
                maxTimeBeforeStart: $scope.lawsDays[i].law.maxTimeBeforeStart,
                minTimeAfterEnd: $scope.lawsDays[i].law.minTimeAfterEnd,
                maxTimeAfterEnd: $scope.lawsDays[i].law.maxTimeAfterEnd,
                moveMinOnStart: $scope.lawsDays[i].law.moveMinOnStart,
                moveMinOnEnd: $scope.lawsDays[i].law.moveMinOnEnd
            }
            if ($scope.lawsDays[i].law.isExtraWork != false) {
                itemToAdd.isExtraWork = $scope.lawsDays[i].law.isExtraWork
            }
            itemToSend.push(itemToAdd)
        }
        requests.postingData("ShiftOffAttributes/CreateGroup/" + $scope.calendarSettingInfoId, itemToSend, function (response) {
            $("#createModal").modal('hide');
            $scope.getShifList();
        })
    }
    $scope.cancelImport = function () {
        $("#createModal").modal('hide');
        $scope.getShifList();
        $scope.$broadcast("cancelImport");
    }
}])
app.controller("createCtrl", function ($scope, $timeout, requests) {
    $scope.levels = [
        {
            title: "مشخصات شیفت کاری",
            id: 1,
            selected: false
        },
        {
            title: "ساعات کاری",
            id: 4,
            selected: false
        },
        {
            title: "تعیین قوانین روز های تعطیل",
            id: 5,
            selected: false
        },
        {
            title: "پرسنل",
            id: 2,
            selected: false
        }, {
            title: "تقویم شیفت کاری",
            id: 3,
            selected: false
        }
    ]
    $timeout(function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }, 500)
    // console.log($scope.editingInfo)
    $scope.levels[0].selected = true;
    $scope.selectedLevel = $scope.levels[0].id;
    $scope.changeLevel = function (level) {
        for (var i = 0; i < $scope.levels.length; i++) {
            $scope.levels[i].selected = false;
        }
        level.selected = true;
        $scope.selectedLevel = level.id
    }
    $scope.confirmUpdateShift = function () {
        // console.log($scope.editingInfo)
        $scope.editingInfo.startDate = $scope.changeDate1($("#editStart").val())
        if ($("#editEnd").val() != "") {
            $scope.editingInfo.endDate = $scope.changeDate1($("#editEnd").val())
        }
        requests.updating("Shifts/Update", $scope.editingInfo, function (response) {
            $scope.changeEditView();
        })
    }
    $scope.loadedHoliday = false;
    $scope.view = false;
    $scope.setChange = function (value) {
        $scope.view = value;
    }

})
app.controller("shiftDetailsCtrl", function ($scope, $timeout, requests) {
    $scope.loadingDetails = true;
    requests.gettingData("ShiftDetails/GetListByShiftId/" + $scope.editingInfo.id, function (response) {
        $scope.loadingDetails = false;
        $scope.detailsList = response.data;
        // console.log(response.data)
    })
    $scope.getDataForDetails = function () {
        $scope.loadingDetails = true;
        requests.gettingData("ShiftDetails/GetListByShiftId/" + $scope.editingInfo.id, function (response) {
            $scope.loadingDetails = false;
            $scope.detailsList = response.data;
            // console.log(response.data)
        })
    }
    $scope.changeCreateMode = function () {
        if ($scope.detailsCreateMode) {
            $scope.detailsCreateMode = false;
            $scope.getDataForDetails();
        } else {

            var item = {
                pageNumber: 1,
                pageSize: 10,
                sortField: null,
                sortAsc: true,
                languageId: 0,
                searchList: [
                ]
            }
            requests.postingData("WeekDays/GetList", item, function (response) {
                // console.log(response.data)
                $scope.days = response.data.item1;
                $scope.shiftsDay = [];
                for (var i = 0; i < $scope.days.length; i++) {
                    var item = {
                        weekDaysId: $scope.days[i].id,
                        weekDaysTitle: $scope.days[i].name,
                        isOff: true,
                    }
                    $scope.shiftsDay.push(item);
                }
                $timeout(function () {
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
                }, 500)
                $scope.createDetail = {
                    shiftDetailDays: [],
                    shiftId: $scope.editingInfo.id,
                    differenceDay: 0,
                    startTime: null,
                    endTime: null,
                    nextStartHour: 0,
                    nextStartMin: 0,
                    description: null,
                    fromDate: null,
                    toDate: null,
                    priority: 0,
                    repeatNumber: 0,
                    title: null,
                    color: null,
                    shiftDetailDays: []
                }
                $scope.detailsCreateMode = true;
            })


        }
    }
    $scope.confirmDetail = function () {
        if ($scope.editingInfo.shiftTypeId == 2) {
            if ($scope.createDetail.nextStartHour > 24) {
                $scope.createDetail.differenceDay = 1;
            }
        }
        $scope.createDetail.startTime = Number($("#detailStartTime").val().split(":")[0]) + ":" + Number($("#detailStartTime").val().split(":")[1]) + ":00"
        $scope.createDetail.endTime = Number($("#detailEndTime").val().split(":")[0]) + ":" + Number($("#detailEndTime").val().split(":")[1]) + ":00"
        $scope.createDetail.fromDate = $scope.changeDate1($("#startDetail").val())
        $scope.createDetail.toDate = $scope.changeDate1($("#endDetail").val())
        for (var i = 0; i < $scope.shiftsDay.lengt; i++) {
            if (!$scope.shiftsDay[i].isOff) {
                $scope.createDetail.shiftDetailDays.push($scope.shiftsDay[i]);
            }
        }
        $scope.createDetail.shiftDetailDays = $scope.shiftsDay;
        // console.log($scope.createDetail);
        requests.postingData("ShiftDetails/UpsertBatch", $scope.createDetail, function (response) {
            $scope.createDetail = {
                shiftDetailDays: [],
                shiftId: $scope.editingInfo.id,
                differenceDay: 0,
                startTime: null,
                endTime: null,
                nextStartHour: 0,
                nextStartMin: 0,
                description: null,
                fromDate: null,
                toDate: null,
                priority: 0,
                repeatNumber: 0,
                color: null,
                title: null,
                shiftDetailDays: []
            }
            $scope.changeCreateMode()
        })
    }
    $scope.confirmDetailEdit = function () {
        if ($scope.editingDetailsInfo.shiftTypeId == 2) {
            if ($scope.editingDetailsInfo.nextStartHour > 24) {
                $scope.editingDetailsInfo.differenceDay = 1;
            }
        }
        $scope.editingDetailsInfo.shiftId = $scope.editingInfo.id,
            $scope.editingDetailsInfo.startTime = Number($("#detailStartTime").val().split(":")[0]) + ":" + Number($("#detailStartTime").val().split(":")[1]) + ":00"
        $scope.editingDetailsInfo.endTime = Number($("#detailEndTime").val().split(":")[0]) + ":" + Number($("#detailEndTime").val().split(":")[1]) + ":00"
        $scope.editingDetailsInfo.fromDate = $scope.changeDate1($("#startDetail").val())
        $scope.editingDetailsInfo.toDate = $scope.changeDate1($("#endDetail").val())
        // console.log($scope.editingDetailsInfo)
        requests.postingData("ShiftDetails/UpsertBatch", $scope.editingDetailsInfo, function (response) {
            $scope.getDataForDetails();
            $scope.changeDetailEditMode()
        })
    }
    $scope.getDiff = function (start, end) {
        var value;
        if (Number($scope.createDetail.endTime.split(":")[0]) == Number($scope.createDetail.startTime.split(":")[0])) {
            value = "0:" + Math.abs(Number($scope.createDetail.endTime.split(":")[1]) - Number($scope.createDetail.startTime.split(":")[1]));
        } else {
            if (Number($scope.createDetail.endTime.split(":")[1]) - Number($scope.createDetail.startTime.split(":")[1]) < 0) {
                value = Number($scope.createDetail.endTime.split(":")[0]) - Number($scope.createDetail.startTime.split(":")[0]) - 1;
                value = value.toString() + ":" + (60 - Math.abs(Number($scope.createDetail.endTime.split(":")[1]) - Number($scope.createDetail.startTime.split(":")[1]))).toString();

            } else {
                value = Number($scope.createDetail.endTime.split(":")[0]) - Number($scope.createDetail.startTime.split(":")[0]);
                value = value + ":" + Math.abs(Number($scope.createDetail.endTime.split(":")[1]) - Number($scope.createDetail.startTime.split(":")[1]));
            }
        }
        // console.log(value)
        return value
    }
    $scope.deleteingShiftDetails = function (item) {
        // console.log(item);
        $scope.detailsForDelete = item;
        $("#deleteConfirmDetails").modal()
    }
    $scope.confirmDeleteDetails = function () {
        requests.deleteing("ShiftDetails/Delete/" + $scope.detailsForDelete.id, {}, function (response) {
            $scope.getDataForDetails();
            $("#deleteConfirmDetails").modal('hide')
        })
    }
    $scope.cancelDeleteDetails = function () {
        $("#deleteConfirmDetails").modal('hide')
    }
    $scope.changeDetailEditMode = function (item) {

        if ($scope.detailsEditMode) {
            $scope.detailsEditMode = false;
        } else {
            if ($scope.shiftsDay == undefined) {
                var item1 = {
                    pageNumber: 1,
                    pageSize: 10,
                    sortField: null,
                    sortAsc: true,
                    languageId: 0,
                    searchList: [
                    ]
                }
                requests.postingData("WeekDays/GetList", item1, function (response) {
                    // console.log(response.data)
                    $scope.days = response.data.item1;
                    $scope.shiftsDay = [];
                    for (var i = 0; i < $scope.days.length; i++) {
                        var item3 = {
                            weekDaysId: $scope.days[i].id,
                            weekDaysTitle: $scope.days[i].name,
                            isOff: true,
                        }
                        $scope.shiftsDay.push(item3);
                    }
                    requests.gettingData("ShiftDetails/GetByIdWithDays/" + item.id, function (response1) {
                        $scope.editingDetailsInfo = response1.data;
                        for (var i = 0; i < $scope.editingDetailsInfo.shiftDetailDays.length; i++) {
                            $scope.editingDetailsInfo.shiftDetailDays[i].shiftDetailsId = item.id
                        }
                        $scope.detailsEditMode = true;
                        $timeout(function () {
                            $(".date-picker").datepicker({
                                dateFormat: "yy/mm/dd",
                                changeMonth: true,
                                changeYear: true
                            });
                            $('#detailStartTime').wickedpicker({
                                now: $scope.editingDetailsInfo.startTime,
                                twentyFour: true,
                                upArrow: 'fa fa-chevron-up',
                                downArrow: 'fa fa-chevron-down'
                            });
                            $('#detailEndTime').wickedpicker({
                                now: $scope.editingDetailsInfo.endTime,
                                twentyFour: true,
                                upArrow: 'fa fa-chevron-up',
                                downArrow: 'fa fa-chevron-down'
                            });
                        }, 500)
                    })
                })
            } else {
                requests.gettingData("ShiftDetails/GetByIdWithDays/" + item.id, function (response) {
                    $scope.editingDetailsInfo = response.data;
                    for (var i = 0; i < $scope.editingDetailsInfo.shiftDetailDays.length; i++) {
                        $scope.editingDetailsInfo.shiftDetailDays[i].shiftDetailsId = item.id
                    }
                    $scope.detailsEditMode = true;
                    $timeout(function () {
                        $(".date-picker").datepicker({
                            dateFormat: "yy/mm/dd",
                            changeMonth: true,
                            changeYear: true
                        });
                        $('#detailStartTime').wickedpicker({
                            now: $scope.editingDetailsInfo.startTime,
                            twentyFour: true,
                            upArrow: 'fa fa-chevron-up',
                            downArrow: 'fa fa-chevron-down'
                        });
                        $('#detailEndTime').wickedpicker({
                            now: $scope.editingDetailsInfo.endTime,
                            twentyFour: true,
                            upArrow: 'fa fa-chevron-up',
                            downArrow: 'fa fa-chevron-down'
                        });
                    }, 500)
                })
            }

        }
    }
    $scope.showWeekDays = function (details) {
        if ($scope.weeksDay) {
            $scope.weeksDay = false
        } else {
            $scope.weeksDay = true;
            $scope.detailTogetWeek = details
        }
    }
    $scope.getWeeksDay = function () {
        requests.gettingData("ShiftDetailDays/GetListByShiftId/" + $scope.detailTogetWeek.id, function (response) {
            $scope.AlreadyTakenDays = response.data
            // console.log($scope.AlreadyTakenDays);
            $scope.firstLoadedDays = true
        })
    }

    // console.log($scope.editingInfo)
})
app.controller("weekCtrl", function ($scope, $timeout, requests) {

    // console.log("$scope.AlreadyTakenDays");
    $scope.getDays = function () {
        var item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: [
            ]
        }
        requests.postingData("WeekDays/GetList", item, function (response) {
            // console.log(response.data)
            $scope.days = response.data.item1
        })
    }
    $scope.checkingDays = function (id) {
        var found = false;
        for (var i = 0; i < $scope.AlreadyTakenDays.length; i++) {
            if (id == $scope.AlreadyTakenDays[i].weekDaysId) {
                found = true;
                break;
            }
        }
        return found;
    }
    $scope.makingDays = function (id) {
        if ($scope.checkingDays(id)) {
            for (var i = 0; i < $scope.AlreadyTakenDays.length; i++) {
                if (id == $scope.AlreadyTakenDays[i].weekDaysId) {
                    $scope.AlreadyTakenDays.splice(i, 1);
                    break
                }
            }
        } else {
            $scope.AlreadyTakenDays.push({ id: id, isOff: false })
            console.log($scope.AlreadyTakenDays)
        }
    }
    $scope.confirmDays = function () {
        var itemToSend = {
            shiftDetailId: $scope.detailTogetWeek.id,
            weekDaysId: $scope.AlreadyTakenDays
        }
        requests.postingData("ShiftDetailDays/CreateBatch", itemToSend, function (response) {
            $scope.showWeekDays();
        })
        // console.log(itemToSend)
    }
})
app.controller("personnelsCtrl", function ($scope, $timeout, requests, currencyConverter) {
    $scope.getPersonnels = function () {
        var item = {
            shiftId: $scope.editingInfo.id,
            personId: null,
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: [
            ]
        }
        requests.gettingData("PersonShift/GetPersonByShift/" + $scope.editingInfo.id, function (response) {
            // console.log(response.data)
            $scope.personnels = response.data
        })
    }

    $scope.getPersonnelsTable = function (item) {
        if ($scope.searchItem.length != 0) {
            item.searchList = $scope.searchItem;
        }
        requests.gettingData("PersonShift/GetPersonActiveByShift/" + $scope.editingInfo.id, item, function (response) {
            // console.log(response.data)
            $scope.personnels = response.data
            $scope.personnels.pagetotal = Math.ceil($scope.personnels.item2 / $scope.personnels.item4)
        })
    }
    $scope.loadPages = function (page) {
        // console.log(page);
        $scope.searchParameter = {
            firstName: null,
            lastName: null
        }
        var item = {
            shiftId: $scope.editingInfo.id,
            pageNumber: null,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: [
            ]
        }
        if (page == 1) {
            if ($scope.personnels.item3 + 1 <= $scope.personnels.pagetotal) {
                item.pageNumber = $scope.personnels.item3 + 1;
                $scope.getPersonnelsTable(item);
            }
        } else if (page == -1) {
            if ($scope.personnels.item3 - 1 > 0) {
                item.pageNumber = $scope.personnels.item3 - 1;
                $scope.getPersonnelsTable(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.getPersonnelsTable(item);

        } else {
            item.pageNumber = $scope.personnels.pagetotal;
            $scope.getPersonnelsTable(item);
        }
    }
    $scope.addToPersonnel = function (personnel) {
        console.log(personnel)
        if ($("#switch-" + personnel.personId).is(":checked")) {
            $scope.connectingList = personnel;
            $scope.connectItem = {
                connectActive: false,
                description: null
            }
            var itemToSend = {
                shiftId: $scope.editingInfo.id,
                personShifts: [
                    {
                        id: personnel.id,
                        personId: personnel.personId,
                        activeFrom: personnel.activeFrom,
                        activeTo: personnel.activeTo,
                        isActive: true
                    }
                ]
            }
            requests.postingData("PersonShift/CreateBatch", itemToSend, function (response) {

            })
        } else {
            $scope.connectingList = personnel;
            $scope.confirmConneccting(false)
            // requests.deleteing("PersonShift/Delete/"+personnel.id,{},function(response) {
            //     var item0 = {
            //         shiftId: $scope.editingInfo.id,
            //         pageNumber: $scope.personnels.item3,
            //         pageSize: 10,
            //         sortField: null,
            //         sortAsc: true,
            //         languageId: 0,
            //         searchList: []
            //     }
            //     // console.log(item0)
            //     $scope.getPersonnelsTable(item0);
            // })
        }
    }
    $scope.searchItem = [];
    $scope.search = function () {
        // console.log($scope.searchParameter)
        $scope.searchItem = [];
        if ($scope.searchParameter.firstName != undefined && $scope.searchParameter.firstName != "") {
            var item = {
                searchValue: $scope.searchParameter.firstName,
                searchField: "P.firstName",
                operatorType: 0,
                operandType: 0
            }
            $scope.searchItem.push(item);
        }
        if ($scope.searchParameter.lastName != undefined && $scope.searchParameter.lastName != "") {
            var item = {
                searchValue: $scope.searchParameter.lastName,
                searchField: "P.lastName",
                operatorType: 0,
                operandType: 0
            }
            $scope.searchItem.push(item);
        }
        var item0 = {
            shiftId: $scope.editingInfo.id,
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: []
        }
        // console.log(item0)
        $scope.getPersonnelsTable(item0);
        // console.log(searchItem)
    }
    $scope.cancelConnecting = function () {
        console.log("this is asdkfjlksd")
        $("#switch-" + $scope.connectingList.personId).prop("checked", false);
        $("#connecting").modal('hide');
    }
    $scope.confirmConneccting = function (active) {
        // console.log($scope.connectItem);
        if (active) {
            var itemToSend = {
                shiftId: $scope.editingInfo.id,
                personShifts: [
                    {
                        personId: $scope.connectingList.personId,
                        activeFrom: $scope.changeDate1($("#formDate").val()),
                        activeTo: $scope.changeDate1($("#toDate").val()),
                        description: $scope.connectItem.description,
                        isActive: $scope.connectItem.connectActive
                    }
                ]
            }
        } else {
            var itemToSend = {
                shiftId: $scope.editingInfo.id,
                personShifts: [
                    {
                        personId: $scope.connectingList.personId,
                        activeFrom: $scope.connectingList.activeFrom,
                        activeTo: $scope.connectingList.activeTo,
                        description: null,
                        isActive: false,
                        id: $scope.connectingList.id
                    }
                ]
            }
        }
        //   console.log(itemToSend)
        requests.postingData("PersonShift/CreateBatch", itemToSend, function (response) {
            var item0 = {
                shiftId: $scope.editingInfo.id,
                pageNumber: $scope.personnels.item3,
                pageSize: 10,
                sortField: null,
                sortAsc: true,
                languageId: 0,
                searchList: []
            }
            // console.log(item0)
            $scope.getPersonnelsTable(item0);
            $("#connecting").modal('hide');
        })
    }
    $scope.loadingPersonnel = false;
    $scope.selectMulti = true;
    $scope.setAll = false;
    $scope.setAllPersonnel = function () {
        $scope.$broadcast("setAllPersonnel");
    }
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
    $scope.multiSelectArray = []
    $scope.addToMultiSelect = function (personnel) {
        if ($('#customCheck-' + personnel.Id).is(":checked")) {
            $scope.multiSelectArray.push(personnel);
        } else {
            for (var i = 0; i < $scope.multiSelectArray.length; i++) {
                if ($scope.multiSelectArray[i].Id == personnel.Id) {
                    $scope.multiSelectArray.splice(i, 1);
                    break;
                }
            }
        }
    }
    $scope.addToMutliPerSetAll = function (item) {
        $scope.multiSelectArray.push(item);
    }
    $scope.checkMulti = function (id) {
        var found = false;
        for (var i = 0; i < $scope.multiSelectArray.length; i++) {
            if ($scope.multiSelectArray[i].Id == id) {
                found = true;
                break;
            }
        }
        return found;
    }
    $scope.setAllPersonnel = function () {
        $scope.multiSelectArray = [];
        if ($scope.setAll) {
            $scope.setAll = false
        } else {
            $scope.setAll = true;
            $scope.$broadcast("changingMulti")
        }
    }
    $scope.confirmAddingPersonnel = function () {
        if ($scope.setAll) {
            $scope.$broadcast("getAllPersonnel");
        } else {
            var itemToSend = {
                shiftId: $scope.editingInfo.id,
                personShifts: []
            }
            for (var i = 0; i < $scope.multiSelectArray.length; i++) {
                var itemToAdd = {
                    personId: $scope.multiSelectArray[i].Id,
                    activeFrom: moment($("#formDate").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD'),
                    activeTo: moment($("#toDate").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD'),
                    isActive: true
                }
                itemToSend.personShifts.push(itemToAdd);
            }
            requests.postingData("PersonShift/CreateBatch", itemToSend, function (response) {
                $scope.cancelAddingPersonnel();
                $scope.getPersonnels();
            })
            // console.log(itemToSend)
        }
    }
    $scope.confirmAllPersonnel = function (item) {
        var itemToSend = {
            shiftId: $scope.editingInfo.id,
            personShifts: []
        }
        for (var i = 0; i < item.length; i++) {
            var itemToAdd = {
                personId: item[i].Id,
                activeFrom: moment($("#formDate").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD'),
                activeTo: moment($("#toDate").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD'),
                isActive: true
            }
            itemToSend.personShifts.push(itemToAdd);
        }
        requests.postingData("PersonShift/CreateBatch", itemToSend, function (response) {
            $scope.cancelAddingPersonnel();
            $scope.getPersonnels();
        })
    }
    $scope.changeDeleteMode = function () {
        $scope.deleteMode = true;
        $scope.patchList = [];
        $scope.fkIds = [];
    }
    $scope.patchList = [];
    $scope.fkIds = [];
    $scope.addToPatchList = function (personnel) {
        if ($("#customCheck-edit-" + personnel.personId).is(":checked")) {
            $scope.patchList.push(personnel.id);
            $scope.fkIds.push(personnel.personId)
        } else {
            for (var i = 0; i < $scope.patchList.length; i++) {
                if ($scope.patchList[i] == personnel.id) {
                    $scope.patchList.splice(i, 1);
                    $scope.fkIds.splice(i, 1);
                    break;
                }
            }
        }
    }
    $scope.cancelDeleteMode = function () {
        $scope.deleteMode = false;
        $$scope.patchList = [];
        $scope.fkIds = [];
    }
    $scope.confirmDeleteMode = function () {
        $("#deletePersonnelConfirm").modal();
    }
    $scope.cancelDeleteModal = function () {
        $("#deletePersonnelConfirm").modal('hide');
        $scope.deleteMode = false;
    }
    $scope.confirmDeleteModal = function () {
        requests.deleteingJson("PersonShift/DeletePersonsBatch", $scope.patchList, function (response) {
            $scope.cancelDeleteModal();
            $$scope.patchList = [];
            $scope.fkIds = [];
            $scope.getPersonnels();
        })
    }
    $scope.editMode = false;
    $scope.changeEditMode = function () {
        $scope.editMode = true;
        $scope.patchList = [];
        $scope.fkIds = [];
    }
    $scope.cancelEditMode = function () {
        $scope.editMode = false;
    }
    $scope.confirmEditMode = function () {
        $("#confirmEditModal").modal();
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }
    $scope.cancelEditModal = function () {
        $("#confirmEditModal").modal('hide');
        $scope.cancelEditMode();
        $scope.patchList = [];
        $scope.fkIds = [];
    }

    $scope.confirmEditModal = function () {
        var itemToSend = {
            ids: $scope.patchList,
            fkIds: $scope.fkIds,
            isActive: $("#activeEdit").is(":checked"),
            activeFrom: $scope.changeDate1($("#editStartDate").val()),
            activeTo: $scope.changeDate1($("#editEndDate").val())
        }
        requests.postingData("PersonShift/UpsertPersonsBatch/" + $scope.editingInfo.id, itemToSend, function (response) {
            $scope.cancelEditModal();
            $scope.getPersonnels();
        })
    }
})
app.controller("calendarViewCtrl", function ($scope, $timeout, requests) {
    $scope.getMonthHoliday = function (month, year, type) {

        $scope.thisMonthHolidays.item1 = [];
        var yearToGet = {
            shiftId: $scope.editingInfo.id,
            fromDate: $scope.changeDate1(year + "/" + month + "/01"),
            toDate: $scope.changeDate1(year + "/" + month + "/" + moment.jDaysInMonth(Number(year), Number(month) - 1)),
            year: year,
            monthId: month
        }
        requests.postingData("Shifts/GetShiftCalendar", yearToGet, function (response) {
            $scope.thisMonthHolidays.item1 = response.data;
            if (type == 1) {
                $scope.$broadcast("delete");
            }
            $scope.loadedHoliday = true;
        })
    }
    var holidayVar = [];
    $scope.thisMonthHolidays = {
        item1: []
    }
    $scope.getYearHoliday = function (year, type) {

        $scope.thisMonthHolidays.item1 = [];
        $scope.loadedHoliday = false;

        requests.gettingData("ShiftOffAttributes/GetListByShiftIdByYear/" + $scope.editingInfo.id + "/" + year, function (response) {
            $scope.thisMonthHolidays = response.data;
            holidayVar = response.data;

            if (type == 1) {
                $scope.$broadcast("delete");
            }
            $scope.loadedHoliday = true;
        })
    }
    $scope.customRateShift = null;
    $scope.dayClick = function (date, type) {
        $scope.shiftCustomDate = date;
        if (type == 1) {
            $("#defineHolidayShift").modal();
        } else if (type == 2) {
            $scope.preSetLawItem = {
                moveMinOnStar: null,
                moveMinOnEnd: null,
                isExtraWork: false,
                hasExtraBeforeStart: null,
                hasExtraAfterEnd: null,
                minTimeBeforeStart: null,
                maxTimeBeforeStart: null,
                minTimeAfterEnd: null,
                maxTimeAfterEnd: null,
                extraHourRate: null
            }
            $("#openDayLawModalShift").modal();
        } else if (type == 3) {

            $("#deleteHolidayConfirm").modal();
        } else {
            $scope.customRateShift = $scope.shiftCustomDate.item.extraHourRate
            $("#offDayLawModalShift").modal();
        }
    }
    $scope.cacnelOpenDayLawShift = function () {
        $("#openDayLawModalShift").modal("hide");
    }
    $scope.confirmOpenDayLawShift = function () {
        var itemToSend = {
            shiftId: $scope.editingInfo.id,
            isOff: false,
            specialDayDate: moment($scope.shiftCustomDate.year + "/" + $scope.shiftCustomDate.month + "/" + $scope.shiftCustomDate.date, 'jYYYY/jM/jD').format('YYYY-MM-DD'),
            moveMinOnStart: $scope.preSetLawItem.moveMinOnStart,
            moveMinOnEnd: $scope.preSetLawItem.moveMinOnEnd,
            isExtraWork: $scope.preSetLawItem.isExtraWork,
            hasExtraBeforeStart: $scope.preSetLawItem.hasExtraBeforeStart,
            hasExtraAfterEnd: $scope.preSetLawItem.hasExtraAfterEnd,
            minTimeBeforeStart: $scope.preSetLawItem.minTimeBeforeStart,
            maxTimeBeforeStart: $scope.preSetLawItem.maxTimeBeforeStart,
            minTimeAfterEnd: $scope.preSetLawItem.minTimeAfterEnd,
            maxTimeAfterEnd: $scope.preSetLawItem.maxTimeAfterEnd,
            extraHourRate: $scope.preSetLawItem.extraHourRate
        }
        requests.postingData("ShiftOffAttributes/Create", itemToSend, function (response) {
            $scope.getYearHoliday($scope.shiftCustomDate.year, null);
            $("#openDayLawModalShift").modal("hide");
        })
    }
    $scope.cancelHolidayOffLawShift = function () {
        $("#offDayLawModalShift").modal("hide");
    }
    $scope.confirmDayOffLawShift = function () {
        var itemToSend = {
            shiftId: $scope.editingInfo.id,
            isOff: true,
            specialDayDate: moment($scope.shiftCustomDate.year + "/" + $scope.shiftCustomDate.month + "/" + $scope.shiftCustomDate.date, 'jYYYY/jM/jD').format('YYYY-MM-DD'),
            extraHourRate: $scope.customRateShift,
            id: $scope.shiftCustomDate.item.id
        }
        requests.updating("ShiftOffAttributes/Update", itemToSend, function (response) {
            $scope.getYearHoliday($scope.shiftCustomDate.year, null);
            $("#offDayLawModalShift").modal("hide");
        })
    }
    $scope.cancelDeleteShift = function () {
        $("#deleteHolidayConfirm").modal("hide");
    }
    $scope.confirmDeleteShift = function () {
        requests.deleteing("ShiftOffAttributes/Delete/" + $scope.shiftCustomDate.item.id, null, function (response) {
            $scope.getYearHoliday($scope.shiftCustomDate.year, null);
            $("#deleteHolidayConfirm").modal("hide");
        })
    }
    $scope.cancelCustomAddingShift = function () {
        $("#defineHolidayShift").modal("hide");
    }
    $scope.confirmCustomAddingShift = function () {
        var itemToSend = {
            shiftId: $scope.editingInfo.id,
            isOff: true,
            specialDayDate: moment($scope.shiftCustomDate.year + "/" + $scope.shiftCustomDate.month + "/" + $scope.shiftCustomDate.date, 'jYYYY/jM/jD').format('YYYY-MM-DD'),
            holidayTypeId: $scope.createHoliday.holidayTypeId,
            holidaysName: $scope.createHoliday.name,
            year: $scope.shiftCustomDate.year,
            month: $scope.shiftCustomDate.month,
        }
        requests.postingData("ShiftOffAttributes/Create", itemToSend, function (response) {
            $scope.getYearHoliday($scope.shiftCustomDate.year, null);
            $("#defineHolidayShift").modal("hide");
        })
    }
    $scope.clanderOptions = [
        {
            title: "تعطیلی این روز",
            id: 1
        }, {
            title: "تغییر قوانین کاری",
            id: 2
        }
    ]
    $scope.clanderOptionsFill = [
        {
            title: "حذف این تعطیلی",
            id: 3
        },
        {
            title: "تغییر قوانین کاری ",
            id: 4
        }
    ]
})
app.controller("preloadcalendarCtrl", function ($scope, requests) {
    $scope.addingHolidayToShift = true;
    $scope.clanderOptions = [
        {
            title: "تعطیلی این روز",
            id: 1
        }, {
            title: "تغییر قوانین کاری",
            id: 2
        }
    ]
    $scope.clanderOptionsFill = [
        {
            title: "حذف این تعطیلی",
            id: 3
        },
        {
            title: "تغییر قوانین کاری ",
            id: 4
        }
    ]
    $scope.getYearHoliday = function (year, type) {
        var m = moment(year + '/01/01', 'jYYYY/jM/jD');
        if (m.isLeapYear()) {
            var endDate = year + "/12/30"
        } else {
            var endDate = year + "/12/29"
        }
        // console.log(yearToGet)
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
            setTimeout(function () {
                $scope.$broadcast("importHoliday");
            }, 1000)
            $scope.loadedHoliday = true;
        })
    }
})
app.controller("holidayTypeCtrl", function ($scope, requests) {
    $scope.getHoldayTypeIds = function () {
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
            $scope.holidayTypeArray = response.data;
            $scope.holidayTypeArray.pagetotal = Math.ceil($scope.holidayTypeArray.item2 / $scope.holidayTypeArray.item4)
            //  console.table($scope.holidayTypeArray.item1);
        })
    }
    $scope.getTypeSetting = function (item) {
        $scope.editingType = item;
        $("#editingTypeModal").modal();
    }
    $scope.cancelTypeSetting = function () {
        $("#editingTypeModal").modal("hide");
    }
    $scope.confirmTypeSetting = function (rate) {
        var item = {
            shiftId: $scope.editingInfo.id,
            holidayTypeId: $scope.editingType.id,
            extraHourRate: rate
        }
        requests.postingData("ShiftOffAttributes/Create", item, function (response) {
            $scope.cancelTypeSetting();
        })
    }
})