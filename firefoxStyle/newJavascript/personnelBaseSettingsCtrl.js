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
            fillNestedClass: false,
            searchList: []
        }
        $scope.personnelConfig = [];
        if (pageItem == null) {
            requests.postingData("RollCallConfigs/GetList", $scope.dataToGetConfigs, function (response) {
                if (response.success == true) {
                    $scope.personnelConfig = response.data;
                    $scope.personnelConfig.totalPage = Math.ceil($scope.personnelConfig.item2 / $scope.personnelConfig.item4)
                } else {
                    alert(response.errorMessages);
                }
            })
        } else {
            requests.postingData("RollCallConfigs/GetList", pageItem, function (response) {
                if (response.success == true) {
                    $scope.personnelConfig = response.data;
                    $scope.personnelConfig.totalPage = Math.ceil($scope.personnelConfig.item2 / $scope.personnelConfig.item4)
                } else {
                    alert(response.errorMessages);
                }
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
            if ($scope.personnelConfig.item3 + 1 <= $scope.personnelConfig.totalPage) {
                item.pageNumber = $scope.personnelConfig.item3 + 1;
                $scope.getPersonnnelConfigList(item);
            }
        } else if (page == -1) {
            if ($scope.personnelConfig.item3 - 1 > 0) {
                item.pageNumber = $scope.personnelConfig.item3 - 1;
                $scope.getPersonnnelConfigList(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.getPersonnnelConfigList(item);

        } else {
            item.pageNumber = $scope.personnelConfig.totalPage;
            $scope.getPersonnnelConfigList(item);
        }
    }


    //------------- btns in row at table ------------------------
    $scope.editConfigInfo = [];
    $scope.editRow = function (data) {
        $scope.editConfigInfo = {
            name: data.name,
            displayName: data.displayName,
            value: data.value,
            type: data.type,
            activeDate: data.activeDate,
            description: data.description,
            id: data.id,
        };
        $('#configEditModal').modal();
        $('#eStartDate').val($scope.convertToShamsi($scope.editConfigInfo.activeDate));
    }
    $scope.removeConfigInfo = [];
    $scope.removeRow = function (data) {
        $scope.removeConfigInfo.push(data.id);
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
        $scope.createConfig = [];
        $("#startDate").val('');
        $('#configCreateModal').modal('hide');
    }

    $scope.cancelConfig = function () {
        $scope.createConfig = [];
        $("#startDate").val('');
        $('#configCreateModal').modal('hide');
    }
    $scope.createConfigs = [];
    $scope.ConfirmCreateConfig = function () {
        $scope.createConfig.activeDate = $scope.convertToMiladi($("#startDate").val());
        $scope.createConfigs.push($scope.createConfig);
        requests.postingData("RollCallConfigs/UpsertRollCallConfigsBatch", $scope.createConfigs, function (response) {
            if (response.success == true) {
                $("#configCreateModal").modal("hide");
                $scope.getPersonnnelConfigList();
            } else {
                alert(response.errorMessages);
            }
        });
    }


    //------------- edit btn modal ------------------------
    $scope.cancelEdit = function () {
        $('#configEditModal').modal('hide');
    }
    $scope.cancelEditOnModal = function () {
        $('#configEditModal').modal('hide');
    }
    $scope.editConfigInfos = [];
    $scope.confirmEditConfig = function () {
        $scope.editConfigInfo.activeDate = $scope.convertToMiladi($('#eStartDate').val());
        $scope.editConfigInfos.push($scope.editConfigInfo);
        requests.postingData("RollCallConfigs/UpsertRollCallConfigsBatch", $scope.editConfigInfos, function (response) {
            if (response.success == true) {
                $scope.getPersonnnelConfigList();
                $("#configEditModal").modal("hide");
            } else {
                alert(response.errorMessages);
            }
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
        requests.delete("RollCallConfigs/DeleteRollCallConfigsBatch", $scope.removeConfigInfo, function (response) {
            if (response.success == true) {
                $("#configRemoveModal").modal('hide');
                $scope.getPersonnnelConfigList();
            } else {
                alert(response.errorMessages);
            }
        })
    }
}])
