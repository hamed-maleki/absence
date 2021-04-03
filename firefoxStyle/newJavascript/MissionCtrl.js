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
    //------------- load page -----------------------
    $scope.MissionDayPage = function (page) {
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
            if ($scope.dayMission.item3 + 1 <= $scope.dayMission.totalPage) {
                item.pageNumber = $scope.dayMission.item3 + 1;
                $scope.GetDayMissionList(item);
            }
        } else if (page == -1) {
            if ($scope.dayMission.item3 - 1 > 0) {
                item.pageNumber = $scope.dayMission.item3 - 1;
                $scope.GetDayMissionList(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.GetDayMissionList(item);

        } else {
            item.pageNumber = $scope.config.totalPage;
            $scope.GetDayMissionList(item);
        }
    }

    $scope.MissionHourPage = function (page) {
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
            if ($scope.hourMission.item3 + 1 <= $scope.hourMission.totalPage) {
                item.pageNumber = $scope.hourMission.item3 + 1;
                $scope.GetHourMissionList(item);
            }
        } else if (page == -1) {
            if ($scope.hourMission.item3 - 1 > 0) {
                item.pageNumber = $scope.hourMission.item3 - 1;
                $scope.GetHourMissionList(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.GetHourMissionList(item);

        } else {
            item.pageNumber = $scope.hourMission.totalPage;
            $scope.GetHourMissionList(item);
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
        $scope.PersonnelIds = $scope.PersonnelIds.substring(00, $scope.PersonnelIds.length - 1);
        $("#selectPersonnel").modal('hide');
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
    //================ Initialize mission type ==========================
    if ($scope.selectedPersonnel != undefined) {
        $scope.personnelInfoExist = true;
    }
    if ($('#selectMissionType').val() == 0) {
        $('#MissionList').attr('disabled', 'desabled');
        $('#AddMission').attr('disabled', 'desabled');
    } else {
        $('#MissionList').removeAttr('disabled');
        $('#AddMission').removeAttr('disabled');
    }
    $scope.AddNewMission = function () {
        if ($('#selectMissionType').val() == 1) {
            $scope.createHourMissionModal();
            $('#HourMissionList').addClass('hidden');
            $('#DayMissionList').addClass('hidden');
        } else if ($('#selectMissionType').val() == 2) {
            $scope.createDayMissionModal();
            $('#HourMissionList').addClass('hidden');
            $('#DayMissionList').addClass('hidden');
        }
    }
    $scope.ShowMissionList = function () {
        if ($('#selectMissionType').val() == 1) {
            $scope.GetHourMissionList();
            $('#HourMissionList').removeClass('hidden');
            $('#DayMissionList').addClass('hidden');
        } else if ($('#selectMissionType').val() == 2) {
            $scope.GetDayMissionList();
            $('#DayMissionList').removeClass('hidden');
            $('#HourMissionList').addClass('hidden');
        }
    }
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
    //============ Get duration Mission in days by function ==========
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

    //------------ Get hour missions List by personnel id ----------------
    $scope.GetHourMissionList = function (pageItem = null) {
        $scope.item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            searchList: []
        }
        $scope.hourMission = [];
        if ($scope.PersonnelIds != undefined) {
            if (pageItem == null) {
                requests.postingData("HourMission/GetListByPersonnel/" + $scope.PersonnelIds, $scope.item, function (response) {
                    $scope.hourMission = response.data;
                    if ($scope.hourMission != null) {
                        $scope.hourMission.totalPage = Math.ceil($scope.hourMission.item2 / $scope.hourMission.item4)
                    }
                })
            } else {
                requests.postingData("HourMission/GetListByPersonnel/" + $scope.PersonnelIds, pageItem, pageItem, function (response) {
                    $scope.hourMission = response.data;
                    if ($scope.hourMission != null) {
                        $scope.hourMission.totalPage = Math.ceil($scope.hourMission.item2 / $scope.hourMission.item4)
                    }
                })
            }
        }
    }

    //----------------------- initial Create hour mission ----------------------
    $scope.createHourMissionModal = function () {
        $scope.createHourMissionData = {
            personId: $scope.selectPersonnelFromDbArray.id,
            missionDate: null,
            hourMissionStateId: 1,
            hourMissionStateTitle: "تایید شده",
            fromTime: {},
            toTime: {}
        };
        $('#createHourModal').modal();
    }
    $scope.EditRowHourRequest = function (item) {
        $scope.editHourMissionData = item;
        $('#EditstartHDate').val($scope.convertToShamsi($scope.editHourMissionData.missionDate));
        $('#EditHourModal').modal();
    }
    $scope.DeleteRowHourRequest = function (item) {
        $scope.deleteId = item.id;
        $('#DeleteHourModal').modal();
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
    $scope.cancelDeleteModalBtn = function () {
        $('#DeleteHourModal').modal('hide');
    }
    $scope.cancelHourMissionDelete = function () {
        $('#DeleteHourModal').modal('hide');
    }

    $scope.canceleditModalBtn = function () {
        $('#EditHourModal').modal('hide');
    }
    $scope.cancelHourMissionEdit = function () {
        $('#EditHourModal').modal('hide');
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
    //----------------------- Edit hour Mission ----------------------
    $scope.confirmHourMissionEdit = function () {
        $scope.editHourMissionData.leaveDate = $scope.convertToMiladi($('#EditstartHDate').val());
        $scope.editHourMissionData.fromTime = $('#EditfromTime').val();
        $scope.editHourMissionData.toTime = $('#EdittoTime').val();
        requests.updating('HourMission/UpdateRequest', $scope.editHourMissionData, function (response) {
            $("#EditHourModal").modal("hide");
            $scope.GetHourMissionList();
        })
        console.log($scope.editHourMissionData);
    }
    //----------------------- Delete hour Mission ----------------------
    $scope.confirmHourMissionDelete = function () {
        requests.deleteing("HourMission/Delete/" + $scope.deleteId, function (response) {
            $("#DeleteHourModal").modal("hide");
            $scope.GetHourMissionList();
        })
    }
    //======================= Create day mission ===========================

    //------------ Get day missions List by personnel id ----------------
    // $scope.GetDayMissionList = function (pageItem = null) {
    //     $scope.item = {
    //         pageNumber: 1,
    //         pageSize: 10,
    //         sortField: null,
    //         sortAsc: true,
    //         languageId: 0,
    //         searchList: []
    //     }
    //     $scope.dayMission = [];
    //     let ids = [];
    //     if ($scope.PersonnelIds != undefined) {
    //         let ids = $scope.PersonnelIds.split(',');
    //         for (let i = 0; i < ids.length; i++) {
    //             if (pageItem == null) {
    //                 requests.postingData("PersonMission/GetListByPersonnelId/" + ids[i], $scope.item, function (response) {
    //                     $scope.dayMission += response.data;
    //                     if ($scope.dayMission != null) {
    //                         $scope.dayMission.totalPage = Math.ceil($scope.dayMission.item2 / $scope.dayMission.item4)
    //                     }
    //                 })
    //             } else {
    //                 requests.postingData("PersonMission/GetListByPersonnelId/" + ids[i], pageItem, function (response) {
    //                     $scope.dayMission += response.data;
    //                     if ($scope.dayMission != null) {
    //                         $scope.dayMission.totalPage = Math.ceil($scope.dayMission.item2 / $scope.dayMission.item4)
    //                     }
    //                 })
    //             }

    //         }
    //     }
    // }
    //------------ Get day missions List gloabaly----------------
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
            requests.postingData("PersonMission/GetList", $scope.item, function (response) {
                $scope.dayMission = response.data;
                if ($scope.dayMission != null) {
                    $scope.dayMission.totalPage = Math.ceil($scope.dayMission.item2 / $scope.dayMission.item4)
                }
            })
        } else {
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
            dayMissionStateId: 1,
            dayMissionTypeId: "تایید شده",
            personIds: $scope.selectPersonnelFromDbArray,
            descriptions: [],
            withoutDayCount: null,
            withDayCount: null,
            hokmNO: null,
        };
        $('#createDayModal').modal();
        $scope.loadCreateModal = true;
        $scope.getTypeOfMission();
        console.log($scope.selectPersonnelFromDbArray);
    }
    $scope.loadEditModal = false;
    $scope.EditRowDayRequest = function (item) {
        $scope.loadEditModal = true;
        $scope.getTypeOfMission();
        $scope.editDayMissionData = item;
        $('#EditstartDayDate').val($scope.convertToShamsi($scope.editDayMissionData.fromDate));
        $('#EditendDayDate').val($scope.convertToShamsi($scope.editDayMissionData.toDate));
        //for mission type------------------------------------------------
        $('#selectedType').children('option').removeAttr('selected');
        $('#selectedType').children('option[value=' + $scope.editDayMissionData.dayMissionTypeId + ']').attr('selected', 'selected');
        //for zone state--------------------------------------------------
        $('#selectZoneType').children('option').removeAttr('selected');
        $('#selectZoneType').children('option[value=' + $scope.editDayMissionData.dayMissionTypeId + ']').attr('selected', 'selected');
        $('#editDayModal').modal();
    }
    $scope.DeleteRowDayRequest = function (item) {
        $scope.deleteDayId = item.requestId;
        $('#DeleteDayModal').modal();
    }
    //----------------------- cancel day mission ----------------------
    $scope.cancelCreateDayModalBtn = function () {
        $scope.createDayMissionData = {};
        $('#createDayModal').modal('hide');
    }
    $scope.cancelDayMissionCreate = function () {
        $scope.createDayMissionData = {};
        $('#createDayModal').modal('hide');
    }
    $scope.cancelEditDayModalBtn = function () {
        $scope.editDayMissionData = {};
        $('#editDayModal').modal('hide');
    }
    $scope.cancelDayMissionEdit = function () {
        $scope.editDayMissionData = {};
        $('#editDayModal').modal('hide');
    }

    $scope.cancelDeleteDayModalBtn = function () {
        $('#DeleteDayModal').modal('hide');
    }
    $scope.cancelDayMissionDelete = function () {
        $('#DeleteDayModal').modal('hide');
    }
    //----------------------- Create day mission ----------------------
    $scope.confirmDayMissionCreate = function () {
        requests.postingData('PersonMission/InsertMissionRequest', $scope.createDayMissionData, function (response) {
            if (!response.data == undefined) {
                $("#createHourModal").modal("hide");
                $scope.GetDayMissionList();
                // console.log(response);
            }
        })
    }
    //----------------------- edit day mission ----------------------
    $scope.confirmDayMissionEdit = function () {
        $scope.editDayMissionData.leaveTypeId = $('#selectedType').val();
        $scope.editDayMissionData.leaveTypeTitle = $('#selectedType').find('option:selected').text();
        $scope.editDayMissionData.fromDate = $scope.convertToMiladi($('#EditstartDayDate').val());
        $scope.editDayMissionData.toDate = $scope.convertToMiladi($('#EditendDayDate').val());
        requests.postingData('PersonMission/UpdateMissionRequest', $scope.editDayMissionData, function (response) {
            if (!response.data == undefined) {
                $("#editDayModal").modal("hide");
                $scope.GetDayMissionList();
            }
        })
    }
    //----------------------- Delete hour mission ----------------------
    $scope.confirmDaymissionDelete = function () {
        requests.postingData("/PersonMission/DeletePersonMissionBatch/" + $scope.deleteDayId, function (response) {
            $("#DeleteDayModal").modal("hide");
            $scope.GetDayMissionList();
        })
    }
}])
