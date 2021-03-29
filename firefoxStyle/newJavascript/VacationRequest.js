var app = angular.module('myApp', ['customService', 'finance3']);
app.controller('PersonnelVacationCtrl', ["$scope", "$timeout", 'currencyConverter', 'requests', function ($scope, $timeout, currencyConverter, requests) {
    $scope.oneSelected = false;
    $scope.selectPersonnelFromDb = {};
    //============= date picker==================

    $timeout(function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }, 500)


    //============================== search and get personnel ====================================
    $scope.searchP = {
        value: null
    }
    $scope.selectMulti = false;
    $scope.setAll = false;
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
    $('.dropdownInVacation').on({
        "click": function (event) {
            if ($(event.target).closest('.dropdown-toggle').length) {
                $(this).data('closable', true);
            } else {
                $(this).data('closable', false);
            }
        },
        "hide.bs.dropdownInVacation": function (event) {
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
        $scope.selectPersonnelFromDb = data;
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
    $scope.setPersonnel = function (data, method) {
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
        $scope.localPersonnel = false;
        $scope.selectPersonnelFromDb = data;
        $scope.loading = true;
        $("#selectPersonnel").modal('hide');
        $scope.settingPersonnelInfo($scope.selectPersonnelFromDb);
        $scope.personnelInfoExist = false;
        if ($scope.selectPersonnelFromDb != undefined) {
            $scope.personnelInfoExist = true;
        }
    }
    console.log($scope.selectPersonnelFromDb);
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
    //================ Initialize Vacation type ==========================

    $('#selectVacationType').on('change', function () {
        if ($(this).val() == 2) {
            $('#DayVacationList').removeClass('hidden');
            $('#HourVacationList').addClass('hidden');
        } else if ($(this).val() == 1) {
            $('#HourVacationList').removeClass('hidden');
            $('#DayVacationList').addClass('hidden');
        } else {
            $('#HourVacationList').addClass('hidden');
            $('#DayVacationList').addClass('hidden');
        }
    })
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
    //============ Get duration vacation in days by function ==========
    $scope.getVacationDays = function (dateFrom, DateTo) {
        var datefrom = new Date(dateFrom.toString().split('T')[0]);
        var dateto = new Date(DateTo.toString().split('T')[0]);
        let Diff_In_Time = dateto.getTime() - datefrom.getTime();
        let Diff_In_Days = Diff_In_Time / (1000 * 3600 * 24);
        return Diff_In_Days;
    }
    //************************ Get data from server *************************

    //------------- type of Vacation --------------------
    $scope.getTypeOfVacation = function () {
        $scope.item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            fillNestedClass: true,
            searchList: []
        }
        requests.postingData('DayLeaveType/GetList', $scope.item, function (response) {
            $scope.selectgroupVacationType = response.data;
        })
    }

    //======================= Create hour Vacation ===========================

    //------------ Get hour Vacations List ----------------
    $scope.GetHourVacationList = function (pageItem = null) {
        $scope.item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: []
        }
        $scope.hourVacation = [];
        if (pageItem == null) {
            // requests.postingData("/HourLeaves/GetListById/"+$scope.selectedPersonnel.id, function (response) {
            requests.postingData("/HourLeaves/GetList", $scope.item, function (response) {
                $scope.hourVacation = response.data;
                if ($scope.hourVacation != null) {
                    $scope.hourVacation.totalPage = Math.ceil($scope.hourVacation.item2 / $scope.hourVacation.item4)
                }
            })
        } else {
            //requests.postingData("/HourLeaves/GetListById/"+$scope.selectedPersonnel.id, pageItem, function (response) {
            requests.postingData("/HourLeaves/GetList", pageItem, function (response) {
                $scope.hourVacation = response.data;
                if ($scope.hourVacation != null) {
                    $scope.hourVacation.totalPage = Math.ceil($scope.hourVacation.item2 / $scope.hourVacation.item4)
                }
            })
        }
    }

    //----------------------- initial Create hour Vacation ----------------------
    $scope.createHourVacationModal = function () {
        $scope.createHourVacationData = {
            personId: $scope.selectPersonnelFromDb.id,
            leaveDate: null,
            fromTime: {},
            toTime: {}
        };
        $('#createHourModal').modal();
    }

    //----------------------- cancel hour Vacation ----------------------
    $scope.cancelCreateModalBtn = function () {
        $scope.createHourVacationData = {};
        $('#createHourModal').modal('hide');
    }
    $scope.cancelHourVacationCreate = function () {
        $scope.createHourVacationData = {};
        $('#createHourModal').modal('hide');
    }

    //----------------------- Create hour Vacation ----------------------
    $scope.confirmHourVacationCreate = function () {
        $scope.createHourVacationData.VacationDate = $scope.convertToMiladi($('#startHDate').val().toString());
        let timeArray = $('#fromTime').val().split(':');
        let timeArrayT = $('#toTime').val().split(':');
        $scope.createHourVacationData.fromTime = {
            hours: timeArray[0],
            minutes: timeArray[1],
        }
        $scope.createHourVacationData.toTime = {
            hours: timeArrayT[0],
            minutes: timeArrayT[1],
        }
        requests.postingData('HourVacation/CreateRequest', $scope.createHourVacationModal, function (response) {
            if (!response.data == undefined) {
                $("#createHourModal").modal("hide");
                $scope.GetHourVacationList();
            }
        })
    }

    //======================= Create day Vacation ===========================

    //------------ Get day Vacations List ----------------
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
    //----------------------- initial Create day Vacation ----------------------
    $scope.loadCreateModal = false;
    $scope.createDayVacationModal = function () {
        $scope.createDayVacationData = {
            zoneId: 0,
            subject: null,
            fromDate: null,
            toDate: null,
            requesterId: 0,
            dayVacationStateId: 1,
            dayVacationTypeId: "تایید شده",
            personIds: $scope.multiSelectArray,
            descriptions: [
                null
            ],
            withoutDayCount: null,
            withDayCount: null,
            hokmNO: null,
        };
        $('#createDayModal').modal();
        $scope.loadCreateModal = true;
        $scope.getTypeOfVacation();

    }

    //----------------------- calcel day Vacation ----------------------
    $scope.cancelCreateDayModalBtn = function () {
        $scope.createDayVacationData = {};
        $('#createDayModal').modal('hide');
    }
    $scope.cancelDayVacationCreate = function () {
        $scope.createDayVacationData = {};
        $('#createDayModal').modal('hide');
    }

    //----------------------- Create day Vacation ----------------------
    $scope.confirmDayVacationCreate = function () {
        requests.postingData('PersonVacation/InsertVacationRequest', $scope.createDayVacationData, function (response) {
            if (!response.data == undefined) {
                $("#createHourModal").modal("hide");
                $scope.GetHourVacationList();
                console.log(response);
            }
        })
    }
}])