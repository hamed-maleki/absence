var app = angular.module('myApp', ['customService']);
app.controller("personnelBaseSettingsCtrl", ["$scope", "$timeout", 'requests', function ($scope, $timeout, requests) {

    //============= date picker==================

    $timeout(function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }, 500)
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
    //============ button functions ======================

    //------------ getting data from server  ----------------
    $scope.getPersonnnelConfigList = function (pageItem = null) {
        $scope.dataToGetConfigs = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: []
        }
        $scope.personnelConfig = [];
        if (pageItem == null) {
            requests.postingData("RollCallConfigs/GetList", $scope.dataToGetConfigs, function (response) {
                $scope.personnelConfig = response.data;
                $scope.personnelConfig.totalPage = Math.ceil($scope.personnelConfig.item2 / $scope.personnelConfig.item4)
            })
        } else {
            requests.postingData("RollCallConfigs/GetList", pageItem, function (response) {
                $scope.personnelConfig = response.data;
                $scope.personnelConfig.totalPage = Math.ceil($scope.personnelConfig.item2 / $scope.personnelConfig.item4)
            })
        }
    }

    //------------- load page -----------------------
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
            languageId: 0,
            searchList: [
            ]
        }
        if (page == 1) {
            if ($scope.config.item3 + 1 <= $scope.config.totalPage) {
                item.pageNumber = $scope.config.item3 + 1;
                $scope.getPersonnnelConfigList(item);
            }
        } else if (page == -1) {
            if ($scope.config.item3 - 1 > 0) {
                item.pageNumber = $scope.config.item3 - 1;
                $scope.getPersonnnelConfigList(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.getPersonnnelConfigList(item);

        } else {
            item.pageNumber = $scope.config.totalPage;
            $scope.getPersonnnelConfigList(item);
        }
    }


    //------------- btns in row at table ------------------------
    $scope.editConfigInfo = [];
    $scope.editRow = function (data) {
        $scope.editConfigInfo = data;
        $('#configEditModal').modal();
    }
    $scope.removeRow = function (data) {
        $scope.removeConfigInfo = data.id;
        $('#configRemoveModal').modal();
    }

    //------------ create new config  ----------------
    $scope.createConfig = [];
    $scope.CreateNewConfig = function () {
        $('#configCreateModal').modal();
        $scope.createConfig = {
            name: null,
            displayName: null,
            value: null,
            type: null,
            activeDate: null,
            description: null
        }
    }

    $scope.cancelCreate = function () {
        $scope.createConfig = {};
        $("#startDate").val('');
        $('#configCreateModal').modal('hide');
    }

    $scope.cancelConfig = function () {
        $scope.createConfig = {};
        $("#startDate").val('');
        $('#configCreateModal').modal('hide');
    }

    $scope.CreateConfig = function () {
        $scope.createConfig.activeDate = $scope.convertToMiladi($("#startDate").val());
        requests.postingData("RollCallConfigs/UpsertRollCallConfigsBatch", $scope.createConfig, function (response) {
            $("#configCreateModal").modal("hide");
            $scope.getPersonnnelConfigList();
        })
    }


    //------------- edit btn modal ------------------------
    $scope.cancelEdit = function () {
        $('#configEditModal').modal('hide');
    }
    $scope.cancelEditOnModal = function () {
        $('#configEditModal').modal('hide');
    }
    $scope.confirmEditConfig = function () {
        requests.postingData("RollCallConfigs/UpsertRollCallConfigsBatch", $scope.editConfigInfo, function (response) {
            $("#configEditModal").modal("hide");
            $scope.getPersonnnelConfigList();
        })
    }
    //------------- remove btn modal ------------------------
    $scope.cancelDelete = function (data) {
        $('#configRemoveModal').modal('hide');
    }
    $scope.cancelRemove = function () {
        $('#configRemoveModal').modal('hide');
    }
    $scope.deleteConfig = function () {

        requests.deleteing("RollCallConfigs/DeleteRollCallConfigsBatch/" + $scope.removeConfigInfo, {}, function (response) {
            $("#deleteConfirm").modal('hide');
            $scope.getPersonnnelConfigList();
        })
    }

}])
