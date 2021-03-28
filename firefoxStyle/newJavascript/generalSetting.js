var app = angular.module('myApp', ['customService']);
app.controller("generalSettingsCtrl", ["$scope", "$timeout", 'requests', function ($scope, $timeout, requests) {

    //============= date picker==================

    $timeout(function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }, 500)
    //=============== edit showing date ================
    $scope.editShowDate = function (date) {
        if (date != null) {
            return moment(date, 'YYYY/M/D').format('jYYYY/jMM/jDD');
        } else {
            return "-"
        }
    }
    //============ button functions ======================

    //------------ getting data from server  ----------------
    $scope.getConfigList = function (pageItem = null) {
        $scope.dataToGetConfigs = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            languageId: 0,
            searchList: []
        }
        $scope.config = [];
        if (pageItem == null) {
            requests.postingData("RollCallConfigs/GetList", $scope.dataToGetConfigs, function (response) {
                $scope.config = response.data;
                $scope.config.totalPage = Math.ceil($scope.config.item2 / $scope.config.item4)
            })
        } else {
            requests.postingData("RollCallConfigs/GetList", pageItem, function (response) {
                $scope.config = response.data;
                $scope.config.totalPage = Math.ceil($scope.config.item2 / $scope.config.item4)
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
                $scope.getConfigList(item);
            }
        } else if (page == -1) {
            if ($scope.config.item3 - 1 > 0) {
                item.pageNumber = $scope.config.item3 - 1;
                $scope.getConfigList(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.getConfigList(item);

        } else {
            item.pageNumber = $scope.config.totalPage;
            $scope.getConfigList(item);
        }
    }


    //------------- btns in row at table ------------------------
    $scope.editRow = function (data) {
        requests.gettingData("RollCallConfigs/GetById/" + data.id, function (response) {
            if (response == null) {
                console.log('error');
            } else {
                $('#eStartDate').val($scope.editShowDate(data.updatedAt));
                $scope.editConfigInfo = response.data;
                console.log(response.data);
            }
        })
        $('#configEditModal').modal();
    }
    $scope.removeRow = function (data) {
        $scope.removeConfigInfo = data.id;
        $('#configRemoveModal').modal();
    }

    //------------ create new config  ----------------
    $scope.CreateNewConfig = function () {
        $('#configCreateModal').modal();
        $scope.createConfig = {
            name: null,
            displayName: null,
            value: null,
            type: null,
            activateDate: null,
            description: null,
            createdBy: 0,
            createdAt: null,
            updatedBy: 0,
            updatedAt: null,
            isDeleted: false,
            crossCheck: null
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
        $scope.createConfig.activateDate = $scope.createConfig.createdAt = moment($("#startDate").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD');
        requests.postingData("RollCallConfigs/UpsertRollCallConfigsBatch", $scope.createConfig, function (response) {
            if (!response.data == undefined) {
                $("#configCreateModal").modal("hide");
                $scope.getConfigList();
                console.log(response);

            } else {
                console.log('error');
            }
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
        $scope.editConfigInfo.updatedAt = moment($("#eStartDate").val(), 'jYYYY/jM/jD').format('YYYY-MM-DD');
        requests.postingData("RollCallConfigs/UpsertRollCallConfigsBatch", $scope.editConfigInfo, function (response) {
            if (!response.data == undefined) {
                $("#configCreateModal").modal("hide");
                $scope.getConfigList();
                console.log("success");
            } else {
                console.log('error');
            }
        })
        //todo....
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
            $scope.getConfigList();
        })
    }

}])
