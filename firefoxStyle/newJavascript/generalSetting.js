var app = angular.module('myApp', ['customService']);
app.controller("generalSettingsCtrl", ["$scope", "$timeout", 'requests', function ($scope, $timeout, requests) {
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
            fillNestedClass: true,
            searchList: [
            ]
        }
        if (page == 1) {
            if ($scope.config.item3 + 1 <= $scope.config.totalPage) {
                item.pageNumber = $scope.config.item3 + 1;
                $scope.getWorkSettingLists(item);
            }
        } else if (page == -1) {
            if ($scope.config.item3 - 1 > 0) {
                item.pageNumber = $scope.config.item3 - 1;
                $scope.getWorkSettingLists(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.getWorkSettingLists(item);

        } else {
            item.pageNumber = $scope.config.totalPage;
            $scope.getWorkSettingLists(item);
        }
    }
    //------------- get list of work settings -----------------------
    $scope.getWorkSettingLists = function (pageItem = null) {
        $scope.item = {
            pageNumber: 1,
            pageSize: 10,
            sortField: null,
            sortAsc: true,
            fillNestedClass: true,
            searchList: []
        }
        $scope.WorkRules = [];
        if (pageItem == null) {
            requests.postingData("WorkSettings/GetList", $scope.item, function (response) {
                $scope.WorkRules = response.data;
                if ($scope.WorkRules != null) {
                    $scope.WorkRules.totalPage = Math.ceil($scope.WorkRules.item2 / $scope.WorkRules.item4)
                }
            })
        } else {
            requests.postingData("WorkSettings/GetList", pageItem, function (response) {
                $scope.WorkRules = response.data;
                if ($scope.WorkRules != null) {
                    $scope.WorkRules.totalPage = Math.ceil($scope.WorkRules.item2 / $scope.WorkRules.item4)
                }
            })
        }
    }

    //------------- create new setting -----------------------
    $scope.CreateWorkSetting = function () {
        $scope.createWorkSetting = {
            isExtraWork: false,
            hasExtraBefore: false,
            hasExtraAfter: false,
            minTimeBefore: 0,
            maxTimeBefore: 0,
            minTimeAfter: 0,
            maxTimeAfter: 0,
            allowedDelayMin: 0,
            allowedHurryMin: 0,
            allowedLeaveDelayMin: 0,
            allowedLeaveHurryMin: 0,
            allowedDelayAddToShortageHour: false,
            allowedHurryAddToShortageHour: false,
            extraHourRate: 0
        };
        $('#createModal').modal();
    }
    $scope.cancelBtn = function () {
        $scope.createWorkSetting = {};
        $('#createModal').modal('hide');
    }
    $scope.cancelSetting = function () {
        $scope.createWorkSetting = {};
        $('#createModal').modal('hide');
    }
    $scope.confirmCreate = function () {
        requests.postingData("WorkSettings/Create", $scope.createWorkSetting, function (response) {
            if (response.data != null) {
                $('#createModal').modal('hide');
                $scope.getWorkSettingLists();
            } else {
                alert("خطا رخ داده است");
            }
        })
    }

    //------------- edit row setting in list -----------------------
    $scope.editBtn = function (data) {
        requests.gettingData('WorkSettings/GetById/' + data.id, function (response) {
            if (response != null) {
                $scope.editWorkSetting = response.data;
            } else {
                alert("خطا رخ داده است");
            }
        })
        $('#editModal').modal();
    }
    $scope.cancleEditBtn = function () {
        $scope.editWorkSetting = {};
        $('#editModal').modal('hide');
    }
    $scope.cancelEdit = function () {
        $scope.editWorkSetting = {};
        $('#editModal').modal('hide');
    }
    $scope.confirmEdit = function () {
        requests.postingData('WorkSettings/Update', $scope.editWorkSetting, function (response) {
            if (response.data != null) {
                $('#createModal').modal('hide');
                $scope.getWorkSettingLists();
                $('#editModal').modal('hide');
            } else {
                alert("خطا رخ داده است");
            }
        })

    }
    //------------- remove row setting in list -----------------------
    $scope.removeBtn = function (data) {
        $scope.removeWorkSettingId = data.id;
        $('#removeModal').modal();
    }
    $scope.cancleRemoveBtn = function () {
        $('#removeModal').modal('hide');
    }
    $scope.cancelDelete = function () {
        $('#removeModal').modal('hide');
    }
    $scope.confirmDelete = function () {
        requests.deleteing("WorkSettings/Delete/" + $scope.removeWorkSettingId, {}, function (response) {
            if (response != null) {
                $("#removeModal").modal('hide');
                $scope.getWorkSettingLists();
            } else {
                alert("خطا رخ داده است");
            }
        })
    }

}])
