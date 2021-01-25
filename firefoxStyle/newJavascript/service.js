var app = angular.module('myApp', ['finance3']);
app.controller('serviceCtrl', function ($scope, $http,currencyConverter) {
    $scope.path = "http://localhost:2232/api/";
    $scope.selectMulti = true;
    $scope.createService = function() {
        $("#createModal").modal();
        $scope.loadingPersonnel = true;
        setTimeout(function () {
            currencyConverter.call()
        }, 500)
    }
    $scope.cancelCreate = function() {
        $("#createModal").modal("hide");
    }
    $scope.deleteData = function() {
        $("#deleteModal").modal()
    }
    $scope.cancelDelete = function() {
        $("#deleteModal").modal("hide")
    }
    $scope.editData = function() {
        $("#editModal").modal({
            backdrop: 'static',
            keyboard: false
        })
        $scope.loadingPersonnel = true;
        setTimeout(function () {
            currencyConverter.call()
        }, 500)
    }
    $scope.cancelEdit = function() {
        $("#editModal").modal("hide");
        $scope.loadingPersonnel = false;
    }
})