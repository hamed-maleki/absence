var app = angular.module('myApp', ['customService', 'finance3']);
app.controller('MissionCtrl', ["$scope", "$timeout", 'currencyConverter', 'requests', function ($scope, $timeout, currencyConverter, requests) {

    //============= date picker==================

    $timeout(function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }, 500)
    //================== search and get personnel ===============================
    $scope.personnelInfoExist = false;
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
        $scope.loading = true;
        // $("#selectPersonnel").modal('hide');
        $scope.settingPersonnelInfo(data);
        $scope.selectPersonnelsFromDb.push(data);
        localStorage.setItem('MultiSelectionPersonnel', JSON.stringify($scope.selectPersonnelsFromDb));
        console.log(JSON.parse(localStorage.getItem('lastSelected')));

    }

    $scope.confirmAddingPersonnel = function () {
        $scope.selectPersonnelFromDbArray = JSON.parse(localStorage.getItem('MultiSelectionPersonnel'));
        $scope.PersonnelIds = "";
        for (let i = 0; i < $scope.selectPersonnelFromDbArray.length; i++) {
            $scope.PersonnelIds += $scope.selectPersonnelFromDbArray[i].Id.toString() + ",";
        }
        if ($scope.selectPersonnelFromDbArray.length != 0) {
            $scope.personnelInfoExist = true;
        }
        console.log($scope.PersonnelIds);
        console.log($scope.selectPersonnelFromDbArray.length)
        // $("#selectPersonnel").modal('hide');
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

    $scope.RemovePersonnelSelection = function (id) {
        var personnelFromData = [];
        personnelFromData.push(JSON.parse(localStorage.getItem('lastSelected')));
        if (personnelFromData.length >= 1) {
            for (let i = 0; i < personnelFromData.length; i++) {
                if (personnelFromData[i].Id == id) {
                    $scope.personnelInfoExist = false;
                }
            }
        }
    }
    //================ Initialize mission type ==========================
    if ($scope.selectedPersonnel != undefined) {
        $scope.personnelInfoExist = true;
    }
    $('#selectMissionType').on('change', function () {
        if ($('#selectMissionType').val() == 2) {
            $('#DayMissionList').removeClass('hidden');
            $('#HourMissionList').addClass('hidden');
        } else if ($('#selectMissionType').val() == 1) {
            $('#HourMissionList').removeClass('hidden');
            $('#DayMissionList').addClass('hidden');
        } else {
            $('#HourMissionList').addClass('hidden');
            $('#DayMissionList').addClass('hidden');
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
    $scope.getMissionDays = function (dateFrom, DateTo) {
        var datefrom = new Date(dateFrom.toString().split('T')[0]);
        var dateto = new Date(DateTo.toString().split('T')[0]);
        let Diff_In_Time = dateto.getTime() - datefrom.getTime();
        let Diff_In_Days = Diff_In_Time / (1000 * 3600 * 24);
        return Diff_In_Days;
    }
    //************************ Get data from server *************************

    //------------- type of mission --------------------
    $scope.getTypeOfMission = function () {
        $scope.item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            fillNestedClass: true,
            searchList: []
        }
        requests.postingData('DayMissionType/GetList', $scope.item, function (response) {
            $scope.selectgroupMissionType = response.data;
            // console.log(response.data);
        })
    }
    //-------------- get zone types -----------------------
    $scope.getZoneType = function () {
        $scope.item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: []
        }
        //it needs to change becuase of hasen't api path at creating this page time
        requests.postingData('DayMissionZoneType/GetList', $scope.item, function (response) {
            $scope.selectZoneType = response.data;
        })
    }

    //======================= Create hour mission ===========================

    //------------ Get hour missions List ----------------
    $scope.GetHourMissionList = function (pageItem = null) {
        $scope.item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: []
        }
        $scope.hourMission = [];
        if (pageItem == null) {
            // requests.postingData("/HourMission/GetListById/"+$scope.selectedPersonnel.id, function (response) {
            requests.postingData("/HourMission/GetList", $scope.item, function (response) {
                $scope.hourMission = response.data;
                if ($scope.hourMission != null) {
                    $scope.hourMission.totalPage = Math.ceil($scope.hourMission.item2 / $scope.hourMission.item4)
                }
            })
        } else {
            //requests.postingData("/HourMission/GetListById/"+$scope.selectedPersonnel.id, pageItem, function (response) {
            requests.postingData("/HourMission/GetList", pageItem, function (response) {
                $scope.hourMission = response.data;
                if ($scope.hourMission != null) {
                    $scope.hourMission.totalPage = Math.ceil($scope.hourMission.item2 / $scope.hourMission.item4)
                }
            })
        }
    }

    //----------------------- initial Create hour mission ----------------------
    $scope.createHourMissionModal = function () {
        $scope.createHourMissionData = {
            personId: $scope.selectPersonnel.id,
            missionDate: null,
            hourMissionStateId: 1,
            hourMissionStateTitle: "تایید شده",
            fromTime: {},
            toTime: {}
        };
        $('#createHourModal').modal();
    }

    //----------------------- cancel hour mission ----------------------
    $scope.cancelCreateModalBtn = function () {
        $scope.createHourMissionData = {};
        $('#createHourModal').modal('hide');
    }
    $scope.cancelHourMissionCreate = function () {
        $scope.createHourMissionData = {};
        $('#createHourModal').modal('hide');
    }

    //----------------------- Create hour mission ----------------------
    $scope.confirmHourMissionCreate = function () {
        $scope.createHourMissionData.missionDate = $scope.convertToMiladi($('#startHDate').val().toString());
        let timeArray = $('#fromTime').val().split(':');
        let timeArrayT = $('#toTime').val().split(':');
        $scope.createHourMissionData.fromTime = {
            hours: timeArray[0],
            minutes: timeArray[1],
        }
        $scope.createHourMissionData.toTime = {
            hours: timeArrayT[0],
            minutes: timeArrayT[1],
        }
        requests.postingData('HourMission/CreateRequest', $scope.createHourMissionModal, function (response) {
            if (!response.data == undefined) {
                $("#createHourModal").modal("hide");
                $scope.GetHourMissionList();
            }
        })
    }

    //======================= Create day mission ===========================

    //------------ Get day missions List ----------------
    $scope.GetDayMissionList = function (pageItem = null) {
        $scope.item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: []
        }
        $scope.dayMission = [];
        if (pageItem == null) {
            //requests.postingData("PersonMission/GetListById/" + $scope.selectedPersonnel.id , $scope.item, function (response) {
            requests.postingData("PersonMission/GetList", $scope.item, function (response) {
                $scope.dayMission = response.data;
                if ($scope.dayMission != null) {
                    $scope.dayMission.totalPage = Math.ceil($scope.dayMission.item2 / $scope.dayMission.item4)
                }
            })
        } else {
            //requests.postingData("PersonMission/GetListById/" + $scope.selectedPersonnel.id , pageItem, function (response) {
            requests.postingData("PersonMission/GetList", pageItem, function (response) {
                $scope.dayMission = response.data;
                if ($scope.dayMission != null) {
                    $scope.dayMission.totalPage = Math.ceil($scope.dayMission.item2 / $scope.dayMission.item4)
                }
            })
        }
    }

    //----------------------- initial Create day mission ----------------------
    $scope.loadCreateModal = false;
    $scope.createDayMissionModal = function () {
        $scope.createDayMissionData = {
            zoneId: 0,
            subject: null,
            fromDate: null,
            toDate: null,
            requesterId: 0,
            dayMissionStateId: 1,
            dayMissionTypeId: "تایید شده",
            personIds: $scope.multiSelectArrayR,
            descriptions: [
                null
            ],
            withoutDayCount: null,
            withDayCount: null,
            hokmNO: null,
        };
        $('#createDayModal').modal();
        $scope.loadCreateModal = true;
        $scope.getTypeOfMission();

    }

    //----------------------- calcel day mission ----------------------
    $scope.cancelCreateDayModalBtn = function () {
        $scope.createDayMissionData = {};
        $('#createDayModal').modal('hide');
    }
    $scope.cancelDayMissionCreate = function () {
        $scope.createDayMissionData = {};
        $('#createDayModal').modal('hide');
    }

    //----------------------- Create day mission ----------------------
    $scope.confirmDayMissionCreate = function () {
        requests.postingData('PersonMission/InsertMissionRequest', $scope.createDayMissionData, function (response) {
            if (!response.data == undefined) {
                $("#createHourModal").modal("hide");
                $scope.GetHourMissionList();
                // console.log(response);
            }
        })
    }

}])
