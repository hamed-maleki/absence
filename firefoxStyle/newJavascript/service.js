var app = angular.module('myApp', ['customService', 'finance3']);
app.controller('serviceCtrl', ["$scope", "$timeout", 'currencyConverter', 'requests', function ($scope, $timeout, currencyConverter, requests) {
    $scope.selectMulti = true;
    $scope.personnelInfoExist = false;
    $scope.moreThanOnePersonnel = false;
    $scope.IsPersonelRemoved = false;
    $scope.loadingPersonnel = false;
    $scope.personnelInService = false;
    //------------- load page -----------------------

    //----------------- search in main list -----------------------
    $scope.loadingPage = function (page) {
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
            if ($scope.services.item3 + 1 <= $scope.services.totalPage) {
                item.pageNumber = $scope.services.item3 + 1;
                $scope.GetServiceList(item);
            }
        } else if (page == -1) {
            if ($scope.services.item3 - 1 > 0) {
                item.pageNumber = $scope.services.item3 - 1;
                $scope.GetServiceList(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.GetServiceList(item);

        } else {
            item.pageNumber = $scope.services.totalPage;
            $scope.GetServiceList(item);
        }
    }
    //----------------- search in edit modal-----------------------
    $scope.EditloadingPage = function (page) {
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
            if ($scope.editServices.item3 + 1 <= $scope.editServices.totalPage) {
                item.pageNumber = $scope.editServices.item3 + 1;
                $scope.GetServiceInEditList(item);
            }
        } else if (page == -1) {
            if ($scope.editServices.item3 - 1 > 0) {
                item.pageNumber = $scope.editServices.item3 - 1;
                $scope.GetServiceInEditList(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.GetServiceInEditList(item);

        } else {
            item.pageNumber = $scope.editServices.totalPage;
            $scope.GetServiceInEditList(item);
        }
    }
    //================= add personnel to service =========================
    $scope.addPersonnelToService = function () {
        $("#selectPersonnel").modal();
        $scope.loadingPersonnel = true;
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
            $scope.PersonnelIds = $scope.PersonnelIds.substring(0, $scope.PersonnelIds.length - 1);
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
    //======================== get service list =========================
    $scope.GetServiceList = function (pageItem = null) {
        $scope.item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            fillNestedClass: true,
            searchList: []
        }
        $scope.services = [];
        if (pageItem == null) {
            requests.postingData("TransportServices/GetList", $scope.item, function (response) {
                $scope.services = response.data;
                if ($scope.services != null) {
                    $scope.services.totalPage = Math.ceil($scope.services.item2 / $scope.services.item4)
                }
            })
        } else {
            requests.postingData("TransportServices/GetList", pageItem, function (response) {
                $scope.services = response.data;
                if ($scope.services != null) {
                    $scope.services.totalPage = Math.ceil($scope.services.item2 / $scope.services.item4)
                }
            })
        }
    }

    //==================== Create service ============================
    $scope.createService = function () {
        $scope.createServiceData = {
            name: null,
            serviceCode: null,
            driver: null,
            description: null,
        }
        $("#createModal").modal();
        setTimeout(function () {
            currencyConverter.call()
        }, 500)
    }
    $scope.cancelCreate = function () {
        $("#createModal").modal("hide");
    }
    $scope.CancelAddPersonnel = function () {
        $("#selectPersonnel").modal("hide");
    }
    $scope.confirmAddingPersonnelEdit = function () {
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
        $("#selectPersonnel").modal("hide");
        $scope.GetServiceInEditList();
    }
    $scope.confirmCreate = function () {
        requests.postingData('TransportServices/Create', $scope.createServiceData, function (response) {
            $("#createModal").modal("hide");
            $scope.GetServiceList();
        })
    }
    //=================================== edit service ===================================
    $scope.editData = function (item) {
        $scope.editServiceData = item;
        $scope.editServices = [];
        $scope.selectPersonnelFromDbArray = [];
        localStorage.setItem('selectedPersonnelForService', JSON.stringify(item));
        $scope.GetServiceInEditList();
        $("#editModal").modal();
    }
    $scope.GetServiceInEditList = function (pageItem = null) {
        let itemId = (JSON.parse(localStorage.getItem('selectedPersonnelForService'))).id;
        $scope.items = {
            transportServiceId: itemId,
            date: moment().format('YYYY-MM-DD'),
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            fillNestedClass: true,
            searchList: [
            ]
        }
        $scope.editServices = [];
        if (pageItem == null) {
            requests.postingData("PersonTransportService/GetPersonByTransportService", $scope.items, function (response) {
                $scope.editServices = response.data;
                if ($scope.editServices != null) {
                    $scope.editServices.totalPage = Math.ceil($scope.editServices.item2 / $scope.editServices.item4)
                    $scope.personnelInService = true;
                }
            })
        } else {
            requests.postingData("PersonTransportService/GetPersonByTransportService", pageItem, function (response) {
                $scope.editServices = response.data;
                if ($scope.editServices != null) {
                    $scope.editServices.totalPage = Math.ceil($scope.editServices.item2 / $scope.editServices.item4)
                    $scope.personnelInService = true;
                }
            })
        }
    }

    $scope.cancelEdit = function () {
        $("#editModal").modal("hide");
    }
    $scope.confirmEdit = function () {
        requests.updating('TransportServices/Update', $scope.editServiceData, function (response) {
            $("#editModal").modal("hide");
            $scope.GetServiceList();
        })
        let itemId = (JSON.parse(localStorage.getItem('selectedPersonnelForService')));
        $scope.selectPersonnelFromDbArray = JSON.parse(localStorage.getItem('MultiSelectionPersonnel'));
        for (let i = 0; i < $scope.selectPersonnelFromDbArray.length; i++) {
            $scope.addingPersonnel = {
                personId: $scope.selectPersonnelFromDbArray[i].Id,
                personName: $scope.selectPersonnelFromDbArray[i].PoliteName,
                transportServiceId: itemId.id,
                transportServiceName: itemId.name,
                fromDate: $scope.convertToMiladi($('#EditstartDayDate').val()),
                toDate: $scope.convertToMiladi($('#EditendDayDate').val())
            }
            requests.postingData('PersonTransportService/Create', $scope.addingPersonnel, function (response) {
            })
        }
    }
    //================================ delete service ====================================
    $scope.deleteData = function (item) {
        $scope.deleteId = item.id;
        $("#deleteModal").modal()
    }
    $scope.RemovePersonnelFromList = function (item) {
        $scope.deletePersonnelId = item.id;
        $("#deleteModalList").modal();
    }
    $scope.cancelDelete = function () {
        $("#deleteModal").modal("hide")
    }
    $scope.confirmDelete = function () {
        requests.deleteing('TransportServices/Delete/' + $scope.deleteId, {}, function (response) {
            $("#deleteModal").modal("hide");
            $scope.GetServiceList();
        })
    }
    //=========================== delete personnel from list ==============================
    $scope.confirmDeleteList = function () {
        requests.deleteing("PersonTransportService/Delete/" + $scope.deletePersonnelId, {}, function (response) {
            console.log(response)
            $("#deleteModalList").modal("hide");
            $scope.GetServiceInEditList();
        })
        console.log($scope.deletePersonnelId);
    }
}])