var app = angular.module('myApp', []);
app.controller("loginCtrl", ["$scope", "$http", function ($scope, $http) {
    $scope.loginItem = {
        username: null,
        password: null
    }
    $scope.path = "https://localhost:44302/Account/Login";
    $scope.checkEnter = function(event) {
        // console.log(event)
        if(event.keyCode == 13) {
            $scope.loginFunction();
        }
    }
    $scope.loginFunction = function () {
        $http({
            url: $scope.path,
            method: "POST",
            ContentType: 'application/x-www-form-urlencoded',
            data: $scope.loginItem,
            dataType: 'json'
        }).then(function (response) {
            // console.log(response.data.data);
            localStorage.setItem("jwtToken",response.data.data.jwtToken);
            localStorage.setItem("refreshToken",response.data.data.jwtRefreshToken);
            window.location.href = "calendar-holiday.html"

        }).catch(function (xhr, status, error) {
        })
    }
}])