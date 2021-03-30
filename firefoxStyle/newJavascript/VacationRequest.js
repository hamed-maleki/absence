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

    //======================= type of Vacation =======================
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
        // if (pageItem == null) {
        //     requests.postingData("HourLeaves/GetListById/" + $scope.selectPersonnelFromDb.id, function (response) {
        //         //requests.postingData("HourLeaves/GetList", $scope.item, function (response) {
        //         $scope.hourVacation = response.data;
        //         if ($scope.hourVacation != null) {
        //             $scope.hourVacation.totalPage = Math.ceil($scope.hourVacation.item2 / $scope.hourVacation.item4)
        //         }
        //     })
        // } else {
        //     requests.postingData("HourLeaves/GetListById/" + $scope.selectPersonnelFromDb.id, pageItem, function (response) {
        //         //requests.postingData("HourLeaves/GetList", pageItem, function (response) {
        //         $scope.hourVacation = response.data;
        //         if ($scope.hourVacation != null) {
        //             $scope.hourVacation.totalPage = Math.ceil($scope.hourVacation.item2 / $scope.hourVacation.item4)
        //         }
        //     })
        // }
    }

    //----------------------- initial Create hour Vacation ----------------------
    $scope.createHourVacationModal = function () {
        $scope.createHourVacationData = {
            personId: null,
            leaveDate: null,
            fromTime: {},
            toTime: {}
        };
        $('#createHourModal').modal();
    }
    $scope.EditRowHourRequest = function (id) {
        requests.gettingData("HourLeaves/GetById/" + id, function (response) {
            $scope.editHourVacationData = response.data;
            $('#EditstartHDate').val($scope.convertToShamsi($scope.editHourVacationData.leaveDate));
        })
        $('#EditHourModal').modal();
    }
    $scope.DeleteRowHourRequest = function (id) {
        $scope.deleteId = id;
        $('#DeleteHourModal').modal();
    }
    //----------------------- cancel hour Vacation modal ----------------------
    $scope.cancelCreateModalBtn = function () {
        $scope.createHourVacationData = {};
        $('#createHourModal').modal('hide');
    }
    $scope.cancelHourVacationCreate = function () {
        $scope.createHourVacationData = {};
        $('#createHourModal').modal('hide');
    }

    $scope.cancelDeleteModalBtn = function () {
        $('#DeleteHourModal').modal('hide');
    }
    $scope.cancelHourVacationDelete = function () {
        $('#DeleteHourModal').modal('hide');
    }

    $scope.canceleditModalBtn = function () {
        $('#EditHourModal').modal('hide');
    }
    $scope.cancelHourVacationEdit = function () {
        $('#EditHourModal').modal('hide');
    }
    //----------------------- Create hour Vacation ----------------------
    $scope.confirmHourVacationCreate = function () {
        $scope.createHourVacationData.leaveDate = $scope.convertToMiladi($('#startHDate').val());
        $scope.createHourVacationData.personId = $scope.selectPersonnelFromDb.Id;
        $scope.createHourVacationData.fromTime = $('#fromTime').val();
        $scope.createHourVacationData.toTime = $('#toTime').val();
        console.log($scope.createHourVacationData);
        requests.postingData('HourLeaves/CreateRequest', $scope.createHourVacationData, function (response) {
            $("#createHourModal").modal("hide");
            $scope.GetHourVacationList();
        })
    }
    //----------------------- Edit hour Vacation ----------------------
    $scope.confirmHourVacationEdit = function () {
        $scope.editHourVacationData.leaveDate = $scope.convertToMiladi($('#EditstartHDate').val());
        $scope.editHourVacationData.personId = $scope.selectPersonnelFromDb.Id;
        $scope.editHourVacationData.fromTime = $('#EditfromTime').val();
        $scope.editHourVacationData.toTime = $('#EdittoTime').val();
        requests.postingData('HourLeaves/UpdateRequest', $scope.editHourVacationData, function (response) {
            $("#EditHourModal").modal("hide");
            $scope.GetHourVacationList();
        })
    }
    //----------------------- Delete hour Vacation ----------------------
    $scope.confirmHourVacationDelete = function () {
        requests.postingData("HourLeaves/Delete/" + $scope.deleteId, function (response) {
            $("#DeleteHourModal").modal("hide");
            $scope.GetHourVacationList();
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
        // if (pageItem == null) {
        //     requests.postingData("PersonLeave/GetListById/"+ $scope.selectPersonnelFromDb.id, function (response) {
        //         $scope.vacation = response.data;
        //         if ($scope.vacation != null) {
        //             $scope.vacation.totalPage = Math.ceil($scope.vacation.item2 / $scope.vacation.item4)
        //         }
        //     })
        // } else {
        //     requests.postingData("PersonLeave/GetListById/"+ $scope.selectPersonnelFromDb.id, function (response) {
        //         $scope.vacation = response.data;
        //         if ($scope.vacation != null) {
        //             $scope.vacation.totalPage = Math.ceil($scope.vacation.item2 / $scope.vacation.item4)
        //         }
        //     })
        // }
    }
    //----------------------- initial Create day Vacation ----------------------
    $scope.loadCreateModal = false;
    $scope.createDayVacationModal = function () {
        $scope.createDayVacationData = {
            personId: $scope.selectPersonnelFromDb.Id,
            personName: $scope.selectPersonnelFromDb.FirstName + " " + $scope.selectPersonnelFromDb.LastName,
            fromDate: null,
            toDate: null,
            leaveStateId: 1,
            leaveStateTitle: "تایید شده",
            leaveTypeId: null,
            leaveTypeTitle: null,
            description: null,
        };
        $('#createDayModal').modal();
        $scope.loadCreateModal = true;
        $scope.getTypeOfVacation();

    }



    //----------------------- cancel day Vacation ----------------------
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
        $scope.createDayVacationData.leaveTypeId = $('#SelectVacationType').val();
        $scope.createDayVacationData.leaveTypeTitle = $('#SelectVacationType').find('option:selected').text();
        $scope.createDayVacationData.fromDate = $scope.convertToMiladi($('#startDayDate').val());
        $scope.createDayVacationData.toDate = $scope.convertToMiladi($('#endDayDate').val());
        console.log($scope.createDayVacationData);
        // requests.postingData('PersonVacation/InsertVacationRequest', $scope.createDayVacationData, function (response) {
        //     if (!response.data == undefined) {
        //         $("#createHourModal").modal("hide");
        //         $scope.GetHourVacationList();
        //         console.log(response);
        //     }
        // })
    }
}])