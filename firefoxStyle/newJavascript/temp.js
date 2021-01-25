var app = angular.module('myApp', []);
app.controller("tempCtrl", ["$scope", "$http", function ($scope, $http) {

    $scope.loadedPage = 'holiday-define.html'
    $scope.path = "https://localhost:44302/Account/Login"
    $scope.loginFunction = function () {
        $http({
            url: $scope.path,
            method: "POST",
            ContentType: 'application/x-www-form-urlencoded',
            data: $scope.loginItem,
            dataType: 'json'
        }).then(function (response) {
            console.log(response.data.data);
            localStorage.setItem("jwtToken",response.data.data.jwtToken);
            window.location.href = "temporaray-container.html"

        }).catch(function (xhr, status, error) {
        })
    }
}])
