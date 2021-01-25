var app = angular.module('myApp', ['customService', 'finance3']);
app.controller('deviceCtrl', function ($scope, $timeout, $http, currencyConverter, requests) {
    $scope.createDevice = function () {
        $scope.createDeviceItem = {
            name: null,
            deviceCode: null,
            ipAddress: null,
            portAddress: null,
            userName: null,
            _password: null,
            address: null,
        }
        $("#createModal").modal();
    }
    $scope.cancelCreate = function () {
        $("#createModal").modal("hide");
    }
    $scope.deleteData = function (item) {
        $scope.deletingItem = item;
        $("#deleteModal").modal()
    }
    $scope.cancelDelete = function () {
        $("#deleteModal").modal("hide")
    }
    $scope.confirmDelete = function () {
        requests.deleteing("AttendanceDevices/Delete/" + $scope.deletingItem.id, null, function (response) {
            $scope.getDevices($scope.currentPage);
            $("#deleteModal").modal("hide")
        })
    }
    $scope.editData = function (item) {
        $scope.editingDevice = item
        $("#editModal").modal({
            backdrop: 'static',
            keyboard: false
        })
    }
    $scope.cancelEdit = function () {
        $("#editModal").modal("hide");
        $scope.getDevices($scope.currentPage);
    }
    $scope.loadPages = function (page) {
        // console.log(page);
        var item = {
            pageNumber: pageNumber,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            fillNestedClass: true,
            searchList: [

            ]
        }
        if (page == 1) {
            if ($scope.devices.item3 + 1 <= $scope.devices.pagetotal) {
                item.pageNumber = $scope.devices.item3 + 1;
                $scope.getDevicesTable(item);
            }
        } else if (page == -1) {
            if ($scope.devices.item3 - 1 > 0) {
                item.pageNumber = $scope.devices.item3 - 1;
                $scope.getDevicesTable(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.getDevicesTable(item);

        } else {
            item.pageNumber = $scope.devices.pagetotal;
            $scope.getDevicesTable(item);
        }
    }
    $scope.getDevicesTable = function (item) {
        requests.postingData("AttendanceDevices/GetList", item, function (response) {
            if (response.data == null) {
                $scope.hasValue = false;
            } else {
                $scope.hasValue = true;
                $scope.devices = response.data;
                $scope.currentPage = item.pageNumber;
                $scope.devices.pagetotal = Math.ceil($scope.devices.item2 / $scope.devices.item4)
            }
        })
    }
    $scope.getDevices = function (pageNumber) {
        $scope.currentPage = pageNumber;
        var item = {
            pageNumber: pageNumber,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            fillNestedClass: true,
            searchList: [

            ]
        }
        requests.postingData("AttendanceDevices/GetList", item, function (response) {
            if (response.data == null) {
                $scope.hasValue = false;
            } else {
                $scope.hasValue = true;
                $scope.devices = response.data;
                $scope.devices.pagetotal = Math.ceil($scope.devices.item2 / $scope.devices.item4)
            }
        })
    }
    $scope.confirmCreate = function () {
        requests.postingData("AttendanceDevices/Create", $scope.createDeviceItem, function (response) {
            $("#createModal").modal("hide");
            $scope.getDevices($scope.currentPage);
        })
    }
    $scope.confirmEdit = function () {
        console.log($scope.createDeviceItem);
        requests.updating("AttendanceDevices/Update", $scope.editingDevice, function (response) {
            $("#editModal").modal("hide");
            $scope.getDevices($scope.currentPage);
        })
    }
    $scope.getPersonnelAndChart = function (device) {
        $scope.parentInfo = device;
        $scope.settingView = true;
        $scope.view = 'personnel'
    }
    $scope.getDevicePersonnel = function () {
        requests.gettingData("PersonAttendanceDevice/GetPersonByAttendanceDevice/" + $scope.parentInfo.id, function (response) {
            // console.log(response);
            if (response.data.length == 0) {
                $scope.noPersonnelSetted = true;
            } else {
                $scope.noPersonnelSetted = false;
                $scope.devicePersonnelArray = response.data;
            }
        })
    }
    $scope.cancelSettingView = function () {
        $scope.settingView = false;
        $scope.parentInfo = null;
    }
    $scope.addPersonnelToDevice = function () {
        $scope.loadingPersonnel = true;
        $("#addingPersonnel").modal();
        $scope.selectMulti = true;
        $timeout(function () {
            currencyConverter.call();
        }, 100)
    }
    $scope.cancelAddingPersonnel = function () {
        $scope.loadingPersonnel = false;
        $("#addingPersonnel").modal('hide');
    }
    $scope.multiSelectArray = [];
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
    $scope.addToMutliPerSetAll = function (item) {
        $scope.multiSelectArray.push(item);
    }
    $scope.setAll = false
    $scope.setAllPersonnel = function () {
        $scope.multiSelectArray = [];
        if ($scope.setAll) {
            $scope.setAll = false
        } else {
            $scope.setAll = true;
            $scope.$broadcast("changingMulti")
        }
    }
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
    $scope.confirmAddingPersonnel = function () {
        if ($scope.setAll) {
            $scope.$broadcast("getAllPersonnel");
        } else {
            var itemToSend = {
                insertIds: [],
                deleteIds: []
            }
            for (var i = 0; i < $scope.multiSelectArray.length; i++) {
                itemToSend.insertIds.push($scope.multiSelectArray[i].Id);
            }
            requests.postingData("PersonAttendanceDevice/PersonsBatch/"+$scope.parentInfo.id, itemToSend, function (response) {
                $scope.cancelAddingPersonnel();
                $scope.getDevicePersonnel();
            })
            // console.log(itemToSend)
        }
    }
    $scope.confirmAllPersonnel = function (item) {
        var itemToSend = {
            insertIds: [],
            deleteIds: []
        }
        for (var i = 0; i < item.length; i++) {
            itemToSend.insertIds.push(item[i].Id);
        }
        requests.postingData("PersonAttendanceDevice/PersonsBatch/"+$scope.parentInfo.id, itemToSend, function (response) {
            $scope.cancelAddingPersonnel();
            $scope.getDevicePersonnel();
        })
    }
    $scope.changePersonnelDeleteMode = function() {
        $scope.personnelDeleteMode = true;
        $scope.fkIds = [];
    }
    $scope.cancelDeleteMode = function() {
        $scope.personnelDeleteMode = false;
        $scope.fkIds = [];
    }
    
    $scope.addToDeleteList = function(personnel) {
        if ($("#customCheck-edit-" + personnel.personId).is(":checked")) {
            // $scope.patchList.push(personnel.id);
            $scope.fkIds.push(personnel.personId)
        } else {
            for (var i = 0; i < $scope.fkIds.length; i++) {
                if ($scope.fkIds[i] == personnel.id) {
                    // $scope.patchList.splice(i, 1);
                    $scope.fkIds.splice(i, 1);
                    break;
                }
            }
        }
    }
    $scope.addToDeleteListChart = function(chart) {
        if ($("#customCheck-edit-chart-" + chart.chartId).is(":checked")) {
            // $scope.patchList.push(personnel.id);
            $scope.fkIds.push(chart.chartId)
        } else {
            for (var i = 0; i < $scope.fkIds.length; i++) {
                if ($scope.fkIds[i] == chart.chartId) {
                    // $scope.patchList.splice(i, 1);
                    $scope.fkIds.splice(i, 1);
                    break;
                }
            }
        }
    }
    $scope.openPersonnelDeleteModal = function() {
        $("#personnelDeleteModal").modal();
    }
    $scope.cancelDeletePersonnel = function() {
        $("#personnelDeleteModal").modal("hide");
        $scope.cancelDeleteMode();
    }
    $scope.changeSettingView = function(item) {
        $scope.selectMultiChart = true;
        $scope.view = item;
    }
    $scope.confirmDeletePersonnel = function() {
        var itemToSend = {
            insertIds: [],
            deleteIds: []
        }
        for (var i = 0; i < $scope.fkIds.length; i++) {
            itemToSend.deleteIds.push($scope.fkIds[i]);
        }
        requests.postingData("PersonAttendanceDevice/PersonsBatch/"+$scope.parentInfo.id, itemToSend, function (response) {
            $scope.cancelDeletePersonnel();
            $scope.getDevicePersonnel();
        })
    }
    $scope.getDeviceChart = function() {
        requests.gettingData("ChartAttendanceDevice/GetChartByAttendanceDevice/"+$scope.parentInfo.id,function(response){
            if (response.data.length == 0) {
                $scope.noChartFound = true;
            } else {
                $scope.noChartFound = false;
                $scope.deviceChartArray = response.data;
            }
        })
    }
    $scope.addChartToDevice = function() {
        $scope.selectMultiChart = true;
        $("#addingchartModal").modal();
        $scope.chartIds = [];
        $scope.allowAddingChart = true;
    }
    $scope.addToChartList = function(id) {
        if($("#check-"+id).is(":checked")){
            $scope.chartIds.push(id);
        }else {
            for(var i = 0; i < $scope.chartIds.length;i++) {
                if(id == $scope.chartIds[i]) {
                    $scope.chartIds.splice(i,1);
                    break;
                }
            }
        }
     }
     $scope.cancelAddingChart = function() {
        $("#addingchartModal").modal("hide");
        $scope.chartIds = [];
        $scope.allowAddingChart = false;
     }
     $scope.confirmAddingchart = function() {
        var itemToSend = {
            insertIds: $scope.chartIds,
            deleteIds: []
        }
        requests.postingData("ChartAttendanceDevice/ChartsBatch/"+$scope.parentInfo.id, itemToSend, function (response) {
            $scope.cancelAddingChart();
            $scope.getDeviceChart();
        })
     }
     $scope.changeChartDeleteMode = function() {
         $scope.chartDeleteMode = true;
         $scope.fkIds = [];
     }
     $scope.cancelDeleteModeChart = function() {
        $scope.chartDeleteMode = false;
     }
     $scope.openDeleteChartModal = function() {
        $("#chartDeleteModal").modal();
     }
     $scope.cancelDeleteChart = function() {
        $("#chartDeleteModal").modal("hide");
        $scope.cancelDeleteModeChart();
    }
    $scope.ConfirmDeleteChart = function() {
        var itemToSend = {
            insertIds: [],
            deleteIds: []
        }
        for (var i = 0; i < $scope.fkIds.length; i++) {
            itemToSend.deleteIds.push($scope.fkIds[i]);
        }
        requests.postingData("ChartAttendanceDevice/ChartsBatch/"+$scope.parentInfo.id, itemToSend, function (response) {
            $scope.cancelDeleteChart();
            $scope.getDeviceChart();
        })
    }
})