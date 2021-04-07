var app = angular.module('myApp', ['customService', 'finance3']);
app.controller('PersonnelVacationCtrl', ["$scope", "$timeout", 'currencyConverter', 'requests', function ($scope, $timeout, currencyConverter, requests) {
    $scope.oneSelected = false;
    $scope.selectPersonnelFromDb = {};
    $scope.selectedPersonnel = {};
    $scope.DayVacationList = false;
    $scope.HourVacationList = false;
    $scope.showList = false;
    $scope.loadingPersonnel = false;
    $scope.selectPersonnelsFromDb = [];
    $scope.PersonnelIds = " ";
    $scope.selectPersonnelFromDbArray = [];
    //----------- toggeler list bar ----------------
    $scope.showListStatus = function () {
        if ($scope.showList == false) {
            $scope.loadingPersonnel = true;
            $scope.selectPersonnel();
        }
    }
    $('#collapsePersonnelList').on('shown.bs.collapse', function () {
        $("#toggleIcon").addClass('fa-arrow-up');
        $("#toggleIcon").removeClass('fa-arrow-down');
    });

    $('#collapsePersonnelList').on('hidden.bs.collapse', function () {
        $("#toggleIcon").removeClass('fa-arrow-up');
        $("#toggleIcon").addClass('fa-arrow-down');
    });
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
    $scope.addToMutliPerSetAll = function (item) {
        $scope.selectPersonnelsFromDb.push(item);
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
    $scope.setAllPersonnel = function () {
        $scope.selectPersonnelsFromDb = [];
        if ($scope.setAll) {
            $scope.setAll = false
        } else {
            $scope.setAll = true;
            $scope.$broadcast("changingMulti")
        }
    }
    $scope.selectPersonnel = function () {
        $scope.localPersonnel = false;
        $scope.showPersonnel = true;
        setTimeout(function () {
            currencyConverter.call()
        }, 10)
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

    $scope.confirmAllPersonnel = function (item) {
        // console.log(item.length)
        for (let i = 0; i < item.length; i++) {
            $scope.PersonnelIds += item[i].Id.toString() + ",";
        }
        $scope.PersonnelIds = $scope.PersonnelIds.substring(0, $scope.PersonnelIds.length - 1);
        localStorage.setItem('MultiSelectionPersonnel', JSON.stringify(item));
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
        $("#collapsePersonnelList").removeClass('show');
        $("#toggleIcon").removeClass('fa-arrow-up');
        $("#toggleIcon").addClass('fa-arrow-down');
    }
    $scope.CancelAddPersonnel = function () {
        $scope.showList = false;
        $scope.loadingPersonnel = false;
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

    $scope.selectId = " ";
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
            if (response.success == true) {
                $scope.selectgroupVacationType = response.data;
            } else {
                alert(response.errorMessages);
            }
        })
    }

    //======================= Create hour Vacation ===========================

    //------------ Get hour Vacations List ----------------


    $scope.GetHourVacationList = function (pageItem = null) {
        $scope.result = $scope.selectPersonnelsFromDb;
        for (var i = 0; i < $scope.result.length; i++) {
            $scope.selectId += $scope.result[i].Id.toString().trim() + ",";
        }
        $scope.selectId = $scope.selectId.substring(0, $scope.selectId.length - 1).split(',');
        $scope.hourVacation = [];
        for (let i = 0; i < $scope.selectId.length; i++) {
            $scope.item = {
                pageNumber: 1,
                pageSize: 10,
                sortField: null,
                sortAsc: true,
                fillNestedClass: true,
                searchList: [
                    {
                        searchValue: $scope.selectId[i].toString(),
                        searchField: "HL.PersonId",
                        operatorType: 0,
                        operandType: 0
                    }]
            }
            if (pageItem == null) {
                requests.postingData("HourLeaves/GetList", $scope.item, function (response) {
                    if (response.success == true) {
                        for (let j = 0; j < response.data.item1.length; j++) {
                            $scope.hourVacation.push(response.data.item1[j]);

                        }
                    } else {
                        alert(response.errorMessages);
                    }

                })

            } else {
                requests.postingData("HourLeaves/GetList", pageItem, function (response) {
                    if (response.success == true) {
                        for (let j = 0; j < response.data.length; j++) {
                            $scope.hourVacation.push(response.data.item1[j]);
                        }
                    } else {
                        alert(response.errorMessages);
                    }
                })
            }
        }
        $scope.hourVacation.totalPage = $scope.hourVacation.length / 10;
        console.log($scope.hourVacation)
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
        $('#EditstartHDate').val($scope.convertToShamsi(data.leaveDate));
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
        $scope.createHourVacationData.fromTime = $('#fromTime').val();
        $scope.createHourVacationData.toTime = $('#toTime').val();

        for (let i = 0; i < $scope.selectId.length; i++) {
            $scope.createHourVacationData.personId = parseInt($scope.selectId[i]);
            requests.postingData('HourLeaves/Create', $scope.createHourVacationData, function (response) {
                if (response.success == true) {
                    $("#createHourModal").modal("hide");
                    $scope.GetHourVacationList();
                } else {
                    alert(response.errorMessages);
                }
            })
        }

    }
    //----------------------- Edit hour Vacation ----------------------
    $scope.confirmHourVacationEdit = function () {
        $scope.editHourVacationData.leaveDate = $scope.convertToMiladi($('#EditstartHDate').val());
        $scope.editHourVacationData.fromTime = $('#EditfromTime').val();
        $scope.editHourVacationData.toTime = $('#EdittoTime').val();
        requests.puttingData('HourLeaves/UpdateRequest', $scope.editHourVacationData, function (response) {
            if (response.success == true) {
                $("#EditHourModal").modal("hide");
                $scope.GetHourVacationList();
            } else {
                alert(response.errorMessages);
            }
        })
    }
    //----------------------- Delete hour Vacation ----------------------
    $scope.confirmHourVacationDelete = function () {

        requests.deleteing("HourLeaves/Delete/" + $scope.deleteId, {}, function (response) {
            if (response.success == true) {
                $scope.GetHourVacationList();
                $("#DeleteHourModal").modal("hide");
            } else {
                alert(response.errorMessages);
            }
        })
    }

    //======================= Create day Vacation ===========================
    $scope.dayVacation = [];
    //------------ Get day Vacations List ----------------
    $scope.GetPersonalVacationList = function (pageItem = null) {
        $scope.result = $scope.selectPersonnelsFromDb;
        for (var i = 0; i < $scope.result.length; i++) {
            $scope.selectId += $scope.result[i].Id.toString().trim() + ",";
        }
        $scope.selectId = $scope.selectId.substring(0, $scope.selectId.length - 1).split(',');
        for (let i = 0; i < $scope.selectId.length; i++) {
            $scope.item = {
                pageNumber: 1,
                pageSize: 10,
                sortField: null,
                sortAsc: true,
                searchList: [{
                    searchValue: $scope.selectId[i].toString(),
                    searchField: "PL.PersonId",
                    operatorType: 0,
                    operandType: 0
                }]
            }

            if (pageItem == null) {
                requests.postingData("PersonLeave/GetList", $scope.item, function (response) {
                    if (response.success == true) {

                        for (let j = 0; j < response.data.item1.length; j++) {
                            $scope.dayVacation.push(response.data.item1[j]);
                        }
                    } else {
                        alert(response.errorMessages);
                    }
                })
            } else {
                requests.postingData("PersonLeave/GetList", $scope.item, function (response) {
                    if (response.success == true) {
                        $scope.dayVacation.push(response.data.item1[j]);
                    } else {
                        alert(response.errorMessages);
                    }
                })
            }
        }
        $scope.dayVacation.totalPage = $scope.dayVacation.length / 10;
    }
    //----------------------- initial Create day Vacation ----------------------
    $scope.loadCreateModal = false;
    $scope.CreateRowDayRequest = function () {
        $scope.getTypeOfVacation();
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

    $scope.deleteDayId = [];
    $scope.DeleteRowDayRequest = function (data) {
        $scope.deleteDayId.push(data.id);
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
    $scope.createDayVacationDatas = [];
    $scope.result = $scope.selectPersonnelsFromDb;
    $scope.confirmDayVacationCreate = function () {
        for (let i = 0; i < $scope.result.length; i++) {
            $scope.createDayVacationData = {
                personId: $scope.result[i].Id,
                personName: $scope.result[i].PoliteName,
                fromDate: $scope.convertToMiladi($('#startDayDate').val()),
                toDate: $scope.convertToMiladi($('#endDayDate').val()),
                leaveStateId: 1,
                leaveStateTitle: "تایید شده",
                leaveTypeId: parseInt($('#SelectVacationType').val()),
                leaveTypeTitle: $('#SelectVacationType').find('option:selected').text().trim(),
                requesterId: 0,
                description: $('#description').val()
            };
            $scope.createDayVacationDatas.push($scope.createDayVacationData);
        }
        requests.postingData('PersonLeave/UpsertPersonLeaveBatch', $scope.createDayVacationDatas, function (response) {
            if (response.success == true) {
                $("#createDayModal").modal("hide");
                $scope.GetPersonalVacationList();
            } else {
                alert(response.errorMessages);
            }
        })

    }
    //----------------------- edit day Vacation ----------------------
    $scope.editDayVacationDatas = [];
    $scope.confirmDayVacationEdit = function () {
        $scope.editDayVacationData.leaveTypeId = parseInt($('#selectedType').val());
        $scope.editDayVacationData.leaveTypeTitle = $('#selectedType').find('option:selected').text();
        $scope.editDayVacationData.fromDate = $scope.convertToMiladi($('#EditstartDayDate').val());
        $scope.editDayVacationData.toDate = $scope.convertToMiladi($('#EditendDayDate').val());
        $scope.editDayVacationDatas.push($scope.editDayVacationData);
        if ($('#selectedType').val() == "?") {
            alert("نوع مرخصی را مشخص نمایید");
        } else {

            requests.puttingData('PersonLeave/UpsertPersonLeaveBatch', $scope.editDayVacationDatas, function (response) {
                if (response.success == true) {
                    $("#editDayModal").modal("hide");
                    $scope.GetPersonalVacationList();
                } else {
                    alert(response.errorMessages);
                }
            })
        }
    }
    //----------------------- Delete day Vacation ----------------------
    $scope.confirmDayVacationDelete = function () {
        requests.delete("PersonLeave/DeletePersonLeaveBatch", $scope.deleteDayId, function (response) {
            if (response.success == true) {
                $("#DeleteDayModal").modal("hide");
                $scope.GetPersonalVacationList();
            } else {
                alert(response.errorMessages);
            }
        })
    }


}])