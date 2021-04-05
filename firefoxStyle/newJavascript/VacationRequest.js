var app = angular.module('myApp', ['customService', 'finance3']);
app.controller('PersonnelVacationCtrl', ["$scope", "$timeout", 'currencyConverter', 'requests', function ($scope, $timeout, currencyConverter, requests) {
    $scope.oneSelected = false;
    $scope.selectPersonnelFromDb = {};
    $scope.selectedPersonnel = {};
    $scope.DayVacationList = false;
    $scope.HourVacationList = false;
    //============= date picker==================

    $timeout(function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }, 500)

    //============= load page ==================
    //----------- hour vacation --------------
    $scope.loadinghourPage = function (page) {
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
            if ($scope.hourVacation.item3 + 1 <= $scope.hourVacation.totalPage) {
                item.pageNumber = $scope.hourVacation.item3 + 1;
                $scope.GetHourVacationList(item);
            }
        } else if (page == -1) {
            if ($scope.hourVacation.item3 - 1 > 0) {
                item.pageNumber = $scope.hourVacation.item3 - 1;
                $scope.GetHourVacationList(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.GetHourVacationList(item);

        } else {
            item.pageNumber = $scope.hourVacation.totalPage;
            $scope.GetHourVacationList(item);
        }
    }
    //----------- day vacation --------------
    $scope.loadingDayPage = function (page) {
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
            if ($scope.dayVacation.item3 + 1 <= $scope.dayVacation.totalPage) {
                item.pageNumber = $scope.dayVacation.item3 + 1;
                $scope.GetPersonalVacationList(item);
            }
        } else if (page == -1) {
            if ($scope.dayVacation.item3 - 1 > 0) {
                item.pageNumber = $scope.dayVacation.item3 - 1;
                $scope.GetPersonalVacationList(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.GetPersonalVacationList(item);

        } else {
            item.pageNumber = $scope.dayVacation.totalPage;
            $scope.GetPersonalVacationList(item);
        }
    }
    //============================== search and get personnel ====================================
    $scope.searchP = {
        value: null
    }
    $scope.selectMulti = false;
    $scope.setAll = false;
    $scope.serachPersonel = function (value) {
        // console.log(value);
        $scope.localPersonnel = false;
        if (value == "") {
            $scope.searchingPosition = false;
        } else {
            $scope.searchingPosition = true;
            currencyConverter.setSearch(value);
        }
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
        $scope.personnelInfoExist = false;
        if ($scope.selectPersonnelFromDb != undefined) {
            $scope.personnelInfoExist = true;
        }
        if (JSON.parse(localStorage.getItem("lastSelected")) != null) {
            $scope.selectedPersonnel = JSON.parse(localStorage.getItem("lastSelected"));
        }
        $("#selectPersonnel").modal('hide');

        $scope.settingPersonnelInfo($scope.selectPersonnelFromDb);
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
                    $('#HourVacationList').addClass('hidden');
                    $('#DayVacationList').addClass('hidden');
                    $('#selectVacationType').val(0);
                }
            }
        }
    }
    //================ Initialize Vacation type ==========================

    $('#selectVacationType').on('change', function () {
        if ($(this).val() == 2) {
            $scope.DayVacationList = true;
            $scope.HourVacationList = false;
            $scope.GetPersonalVacationList();
        } else if ($(this).val() == 1) {
            $scope.DayVacationList = false;
            $scope.HourVacationList = true;
            $scope.GetHourVacationList();
        } else {
            $scope.HourVacationList = false;
            $scope.DayVacationList = false;
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
            fillNestedClass: true,
            searchList: [
                {
                    searchValue: $scope.selectedPersonnel[0].Id.toString(),
                    searchField: "HL.PersonId",
                    operatorType: 0,
                    operandType: 0
                }]
        }
        $scope.hourVacation = [];
        if (pageItem == null) {
            requests.postingData("HourLeaves/GetList", $scope.item, function (response) {
                $scope.hourVacation = response.data;
                if ($scope.hourVacation != null) {
                    $scope.hourVacation.totalPage = Math.ceil($scope.hourVacation.item2 / $scope.hourVacation.item4)
                }
            })
        } else {
            requests.postingData("HourLeaves/GetList", pageItem, function (response) {
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
            personId: null,
            leaveDate: null,
            fromTime: {},
            toTime: {}
        };
        $('#createHourModal').modal();
    }
    $scope.EditRowHourRequest = function (data) {
        $scope.editHourVacationData = data;
        $('#EditHourModal').modal();
    }
    $scope.DeleteRowHourRequest = function (data) {
        $scope.deleteId = data.id;
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
        requests.postingData('HourLeaves/Create', $scope.createHourVacationData, function (response) {
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
        requests.puttingData('HourLeaves/UpdateRequest', $scope.editHourVacationData, function (response) {
            $("#EditHourModal").modal("hide");
            $scope.GetHourVacationList();
        })
    }
    //----------------------- Delete hour Vacation ----------------------
    $scope.confirmHourVacationDelete = function () {
        requests.deleteing("HourLeaves/Delete/" + $scope.deleteId, function (response) {
            $("#DeleteHourModal").modal("hide");
            $scope.GetHourVacationList();
        })
    }

    //======================= Create day Vacation ===========================

    //------------ Get day Vacations List ----------------
    $scope.GetPersonalVacationList = function (pageItem = null) {
        console.log($scope.selectedPersonnel[0].Id.toString());
        $scope.item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: [{
                searchValue: $scope.selectedPersonnel[0].Id.toString(),
                searchField: "PL.PersonId",
                operatorType: 0,
                operandType: 0
            }]
        }
        $scope.dayVacation = [];
        if (pageItem == null) {
            requests.postingData("PersonLeave/GetList", $scope.item, function (response) {
                $scope.dayVacation = response.data;
                if ($scope.dayVacation != null) {
                    $scope.dayVacation.totalPage = Math.ceil($scope.dayVacation.item2 / $scope.dayVacation.item4)
                }
            })
        } else {
            requests.postingData("PersonLeave/GetList", $scope.item, function (response) {
                $scope.dayVacation = response.data;
                if ($scope.dayVacation != null) {
                    $scope.dayVacation.totalPage = Math.ceil($scope.dayVacation.item2 / $scope.dayVacation.item4)
                }
            })
        }
    }
    //----------------------- initial Create day Vacation ----------------------
    $scope.loadCreateModal = false;
    $scope.CreateRowDayRequest = function () {
        $scope.getTypeOfVacation();
        $scope.createDayVacationData = {
            personId: $scope.selectPersonnelFromDb.Id,
            personName: $scope.selectPersonnelFromDb.FirstName + " " + $scope.selectPersonnelFromDb.LastName,
            fromDate: null,
            toDate: null,
            leaveStateId: 1,
            leaveStateTitle: "تایید شده",
            leaveTypeId: null,
            leaveTypeTitle: null,
            description: null
        };
        $('#createDayModal').modal();
        $scope.loadCreateModal = true;

    }
    $scope.loadEditModal = false;
    $scope.EditRowDayRequest = function (data) {
        $scope.loadEditModal = true;
        $scope.editDayVacationData = {
            personId: data.personId,
            personName: data.personName,
            fromDate: data.fromDate,
            toDate: data.toDate,
            leaveStateId: data.leaveStateId,
            leaveStateTitle: data.leaveStateTitle,
            leaveTypeId: data.leaveTypeId,
            leaveTypeTitle: data.leaveTypeTitle,
            description: data.description,
            id: data.id
        };
        $scope.getTypeOfVacation();
        $('#selectedType option:selected').removeAttr('selected');
        $('#selectedType').children('option[value=' + $scope.editDayVacationData.leaveTypeId + ']').attr('selected', 'selected');
        $('#EditstartDayDate').val($scope.convertToShamsi($scope.editDayVacationData.fromDate));
        $('#EditendDayDate').val($scope.convertToShamsi($scope.editDayVacationData.toDate));
        $('#editDayModal').modal();
    }
    $scope.DeleteRowDayRequest = function (data) {
        $scope.deleteDayId = data.id;
        $('#DeleteDayModal').modal();
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

    $scope.cancelEditDayModalBtn = function () {
        $scope.editDayVacationData = {};
        $('#editDayModal').modal('hide');
    }
    $scope.cancelDayVacationEdit = function () {
        $scope.editDayVacationData = {};
        $('#editDayModal').modal('hide');
    }

    $scope.cancelDeleteDayModalBtn = function () {
        $('#DeleteDayModal').modal('hide');
    }
    $scope.cancelDayVacationDelete = function () {
        $('#DeleteDayModal').modal('hide');
    }

    //----------------------- Create day Vacation ----------------------
    $scope.confirmDayVacationCreate = function () {
        $scope.createDayVacationData.leaveTypeId = parseInt($('#SelectVacationType').val());
        $scope.createDayVacationData.leaveTypeTitle = $('#SelectVacationType').find('option:selected').text().trim();
        $scope.createDayVacationData.fromDate = $scope.convertToMiladi($('#startDayDate').val());
        $scope.createDayVacationData.toDate = $scope.convertToMiladi($('#endDayDate').val());

        requests.postingData('PersonLeave/CreateRequest', $scope.createDayVacationData, function (response) {
            $("#createDayModal").modal("hide");
            $scope.GetPersonalVacationList();

        })
        // console.log($scope.createDayVacationData);
    }
    //----------------------- edit day Vacation ----------------------
    $scope.confirmDayVacationEdit = function () {
        $scope.editDayVacationData.leaveTypeId = parseInt($('#selectedType').val());
        $scope.editDayVacationData.leaveTypeTitle = $('#selectedType').find('option:selected').text();
        $scope.editDayVacationData.fromDate = $scope.convertToMiladi($('#EditstartDayDate').val());
        $scope.editDayVacationData.toDate = $scope.convertToMiladi($('#EditendDayDate').val());
        if ($('#selectedType').val() == "?") {
            alert("نوع مرخصی را مشخص نمایید");
        } else {

            requests.puttingData('PersonLeave/UpdateRequest', $scope.editDayVacationData, function (response) {
                $("#editDayModal").modal("hide");
                $scope.GetPersonalVacationList();
            })
            // console.log($scope.editDayVacationData);
        }
        // console.log($scope.editDayVacationData);
    }
    //----------------------- Delete hour Vacation ----------------------
    $scope.confirmDayVacationDelete = function () {
        requests.deleteing("PersonLeaves/Delete/" + $scope.deleteDayId, function (response) {
            $("#DeleteDayModal").modal("hide");
            $scope.GetPersonalVacationList();
        })
    }


}])