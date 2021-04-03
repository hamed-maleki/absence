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
            if ($scope.WorkRules.item3 + 1 <= $scope.WorkRules.totalPage) {
                item.pageNumber = $scope.WorkRules.item3 + 1;
                $scope.getWorkSettingLists(item);
            }
        } else if (page == -1) {
            if ($scope.WorkRules.item3 - 1 > 0) {
                item.pageNumber = $scope.WorkRules.item3 - 1;
                $scope.getWorkSettingLists(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.getWorkSettingLists(item);

        } else {
            item.pageNumber = $scope.WorkRules.totalPage;
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
        $scope.createWork = {
            isExtraWork: false,
            hasExtraBefore: false,
            hasExtraAfter: false,
            minTimeBefore: null,
            maxTimeBefore: null,
            minTimeAfter: null,
            maxTimeAfter: null,
            allowedDelayMin: null,
            allowedHurryMin: null,
            allowedLeaveDelayMin: null,
            allowedLeaveHurryMin: null,
            allowedDelayAddToShortageHour: false,
            allowedHurryAddToShortageHour: false,
            extraHourRate: null
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
        requests.postingData("WorkSettings/Create", $scope.createWork, function (response) {
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
        $scope.editWorkSetting = data;
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
            $scope.getWorkSettingLists();
            $('#editModal').modal('hide');
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
            $("#removeModal").modal('hide');
            $scope.getWorkSettingLists();
        })
    }

}])
