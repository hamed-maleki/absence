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
    //================== search personnel ===============================
    $scope.searchPInMission = {
        value: null
    };
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
    $scope.oneSelected = false;
    $scope.searchingPositionChange = function () {
        $scope.searchingPosition = false;
        $scope.searchP.value = null;
    }
    $scope.filterItems = [
        {
            title: "عادی",
            selected: false,
            id: 1
        },
        {
            title: "از طریق کارت ساعت",
            selected: false,
            id: 2
        },
        {
            title: "ورود دستی",
            selected: false,
            id: 4
        },
        {
            title: "مرخصی",
            selected: false,
            id: 8
        },
        {
            title: "ماموریت",
            selected: false,
            id: 16
        },
        {
            title: "نرددهای ناقص",
            selected: false,
            id: 32
        },
        {
            title: "روزهای فاقد تردد",
            selected: false,
            id: 64
        },
    ]
    $scope.removeFilter = function (item) {
        item.selected = false;
    }

    $scope.serachPersonel = function (value) {
        $scope.localPersonnel = false;
        if (value == "") {
            $scope.searchingPosition = false;
        } else {
            $scope.searchingPosition = true;
            currencyConverter.setSearch(value);
        }
    }
    $scope.selectPersonnel = function () {
        $scope.localPersonnel = false;
        $("#selectPersonnel").modal();
        $scope.loadingPersonnel = true;
        setTimeout(function () {
            currencyConverter.call()
        }, 500)
    }
    $scope.settingPersonnelInfo = function (data) {
        $scope.selectedPersonnel = data;
        localStorage.setItem("lastSelected", JSON.stringify(data));
        // for (var i = 0; i < 31; i++) {
        //     itemToAdd = {
        //         date: moment().add(i, 'days').format('jYYYY/jM/jD')
        //     }
        //     $scope.customMonth.push(itemToAdd);
        // }
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
            // var dataToShift = JSON.stringify(dataLocal);
            localStorage.setItem("localPersonnelItem", JSON.stringify(dataLocal));
        }
        $scope.localPersonnel = false;
        $scope.selectedPersonnel = data;
        if (data.Name == undefined) {
            $scope.searchP.value = data.PoliteName
        } else {
            $scope.searchP.value = data.Name + " " + data.Family;
            $("#personnel-input").val(data.Name + " " + data.Family)
        }
        $scope.searchingPosition = false;
        $scope.loading = true;
        $("#selectPersonnel").modal('hide');
        $scope.settingPersonnelInfo($scope.selectedPersonnel);
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
    //================ Initialize mission type ==========================
    $scope.personnelInfoExist = false;
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
    //============ Get duration vacation in days by function ==========
    $scope.getMissionDays = function (dateFrom, DateTo) {
        var datefrom = new Date(dateFrom.toString().split('T')[0]);
        var dateto = new Date(DateTo.toString().split('T')[0]);
        let Diff_In_Time = dateto.getTime() - datefrom.getTime();
        let Diff_In_Days = Diff_In_Time / (1000 * 3600 * 24);
        return Diff_In_Days;
    }
    //============ Get data from server ======================
    //------------ day missions ----------------
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
    //------------ hour missions ----------------
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
    //============================ Create Missions ================================

    //----------------------- Create hour mission ----------------------
    $scope.createHourMissionModal = function () {
        $scope.createHourMissionData = {
            personId: $scope.selectPersonnel.id,
            missionDate: null,
            fromTime: {},
            toTime: {},
            hourMissionStateId: 0,
            hourMissionStateTitle: null,
            id: null
        };
        $('#createHourModal').modal();
    }
    $scope.cancelCreateModalBtn = function () {
        $scope.createHourMissionData = {};
        $('#createHourModal').modal('hide');
    }
    $scope.cancelHourMissionCreate = function () {
        $scope.createHourMissionData = {};
        $('#createHourModal').modal('hide');
    }

    $scope.confirmHourMissionCreate = function () {
        //todo...
    }


    //----------------------- Create day mission ----------------------
    $scope.createDayMissionModal = function () {
        $scope.createDayMissionData = {
            personId: $scope.selectPersonnel.id,
            personName: $scope.selectPersonnel.Name,
            requestId: null,
            fromDate: null,
            toDate: null,
            missionReport: null,
            ticketPrice: null,
            kilometer: null,
            withoutDayCount: null,
            withDayCount: null,
            otherExpense: null,
            hokmNO: null,
            hardWork: null,
            residencePrice: true,
            rewardableMission1: null,
            rewardableMission2: null,
            rewardableMission3: null,
            rewardableMission4: null,
            rewardableMission5: null,
            rewardableMission6: null,
            rewardableMission7: null,
            dayMissionStateId: null,
            missionStateTitle: null,
            dayMissionTypeId: null,
            missionTypeTitle: null,
            description: null,
            id: null
        };
        $('#createDayModal').modal();
    }
    $scope.cancelCreateDayModalBtn = function () {
        $scope.createDayMissionData = {};
        $('#createDayModal').modal('hide');
    }
    $scope.cancelDayMissionCreate = function () {
        $scope.createDayMissionData = {};
        $('#createDayModal').modal('hide');
    }
    $scope.confirmDayMissionCreate = function () {
        //todo...
    }

}])
