var app = angular.module('myApp');
app.controller('PersonnelCtrl', ['$scope', '$http', '$compile', '$timeout', 'currencyConverter', function ($scope, $http, $compile, $timeout, currencyConverter) {
    setTimeout(function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }, 100)
    // $scope.path = "http://192.168.43.106/api/"
    $scope.path = "http://192.168.200.101/api/"
    // console.log(window.location.toString().split("/")[3])
    // if (window.location.toString().split("/")[3] == "Organization" || window.location.toString().split("/")[3] == "Kargozini" || window.location.toString().split("/")[3] == "EvaluatinForm" || window.location.toString().split("/")[3] == "Personnels" || window.location.toString().split("/")[3] == "PersonnelActionForm"|| window.location.toString().split("/")[3] =="GlobalValue") {
    //     $scope.path = "http://localhost:2232"
    // } else {
    //     $scope.path = "http://localhost:2232"
    // }
    $scope.getData = function (route, callback) {
        $http({
            url: $scope.path + route,
            method: "GET",
            ContentType: "application/json; charset=utf-8",
            dataType: 'JSON',
        })
            .then(function (response) {
                callback(response.data);
            })
            .catch(function (xhr) {
                callback(xhr);
            })
    }
    $scope.searchItems = {
        name: "",
        family: "",
        fatherName: "",
        nationalCode: "",
        birthCode: "",
        personnelCode: "",
        employeeCode: "",
        sex: "",
        tri: null,
        treeName: null,
        marrige: [],
        ageFrom: "",
        ageUntil: "",
        warStatus: [],
        serviceStatus: [],
        employeeStatus: [],
        jobType: [],
        employmentFrom: "",
        employmentUntil: "",
        childrenCountFrom: "",
        childrenCountUntil: ""
    }
    $scope.getStateArray = function () {
        $scope.getData("employees/state?paging.pn=1", function (response) {
            $scope.stateArray = response;
            $scope.statePath = "employees/state?paging.pn="
        })
    }
    $scope.searchState = function (item) {
        $scope.stateSearch = item;
        $scope.getData($scope.statePath + "1&search.q=" + item, function (response) {
            $scope.stateArray = response;
        })
    }
    $scope.searchParam = '';
    $scope.getTableData = function (url) {
        $scope.getData(url, function (response) {
            if (response.status == undefined) {
                $scope.tableData = response;
                console.log($scope.setAll)
                if ($scope.setAll) {
                    for (var i = 0; i < $scope.tableData.Items.length; i++) {
                        $scope.multiSelectArray.push($scope.tableData.Items[i]);
                    }
                }
            } else {
                $scope.tableData = [];
            }
        })
    }
    $scope.getTableDataSearch = function (url) {

        $scope.getData(url, function (response) {
            $scope.searchTableData = response;
        })
    }
    $scope.$on("getAllPersonnel", function (evt) {
        var searchParameter = '?page=1';
        if ($scope.searchItems.name != "") {
            searchParameter = searchParameter + "&&search.n=" + $scope.searchItems.name
        }
        if ($scope.searchItems.family != "") {
            searchParameter = searchParameter + "&&search.f=" + $scope.searchItems.family
        }
        if ($scope.searchItems.fatherName != "") {
            searchParameter = searchParameter + "&&search.fn=" + $scope.searchItems.fatherName
        }
        if ($scope.searchItems.nationalCode != "") {
            searchParameter = searchParameter + "&&search.nc=" + $scope.searchItems.nationalCode
        }
        if ($scope.searchItems.personnelCode != "") {
            searchParameter = searchParameter + "&&search.pnn=" + $scope.searchItems.personnelCode
        }
        if ($scope.searchItems.employeeCode != "") {
            searchParameter = searchParameter + "&&search.dn=" + $scope.searchItems.employeeCode
        }
        if ($scope.searchItems.ageFrom != "") {
            searchParameter = searchParameter + "&&search.ag1=" + $scope.searchItems.ageFrom
        }
        if ($scope.searchItems.ageUntil != "") {
            searchParameter = searchParameter + "&&search.ag2=" + $scope.searchItems.ageUntil
        }
        if ($scope.searchItems.childrenCountFrom != "") {
            searchParameter = searchParameter + "&&search.cf=" + $scope.searchItems.childrenCountFrom
        }
        if ($scope.searchItems.childrenCountUntil != "") {
            searchParameter = searchParameter + "&&search.cu=" + $scope.searchItems.childrenCountUntil
        }
        if ($scope.searchItems.sex != "" && $scope.searchItems.sex != 0) {
            searchParameter = searchParameter + "&&search.gn=" + $scope.searchItems.sex
        }
        if ($("#from").val() != '') {
            searchParameter = searchParameter + "&&search.efd=" + $("#from").val()
        }
        if ($("#until").val() != '') {
            searchParameter = searchParameter + "&&search.eud=" + $("#until").val()
        }
        if ($scope.searchItems.tri != null) {
            searchParameter = searchParameter + "&&search.tri=" + $scope.searchItems.tri
        }
        if ($scope.searchItems.marrige.length != 0) {
            var mValue = 0
            for (var i = 0; i < $scope.searchItems.marrige.length; i++) {
                mValue = mValue + $scope.searchItems.marrige[i].Id
            }
            searchParameter = searchParameter + "&&search.ms=" + mValue;
        }
        if ($scope.searchItems.warStatus.length != 0) {
            var wValue = 0
            for (var i = 0; i < $scope.searchItems.warStatus.length; i++) {
                wValue = wValue + $scope.searchItems.warStatus[i].Id
            }
            searchParameter = searchParameter + "&&search.wt=" + wValue;
        }
        if ($scope.searchItems.jobType.length != 0) {
            var jValue = 0
            for (var i = 0; i < $scope.searchItems.jobType.length; i++) {
                jValue = jValue + $scope.searchItems.jobType[i].Id
            }
            searchParameter = searchParameter + "&&search.jt=" + jValue;
        }
        if ($scope.searchItems.serviceStatus.length != 0) {
            var jValue = $scope.searchItems.serviceStatus[0].Id
            for (var i = 1; i < $scope.searchItems.serviceStatus.length; i++) {
                jValue = jValue + "," + $scope.searchItems.serviceStatus[i].Id
            }
            searchParameter = searchParameter + "&&search.et=" + jValue;
        }
        if ($scope.searchItems.employeeStatus.length != 0) {
            var jValue = $scope.searchItems.employeeStatus[0].Id
            for (var i = 1; i < $scope.searchItems.employeeStatus.length; i++) {
                jValue = jValue + "," + $scope.searchItems.employeeStatus[i].Id
            }
            searchParameter = searchParameter + "&&search.es=" + jValue;
        }
        $scope.searchParam = searchParameter;
        $scope.getData("personnel/nopg" + searchParameter, function (response) {
            // console.log(response);
            $scope.confirmAllPersonnel(response)
        })
    })
    $scope.$on("changingMulti", function (evt) {
        if ($scope.setAll) {
            for (var i = 0; i < $scope.tableData.Items.length; i++) {
                $scope.addToMutliPerSetAll($scope.tableData.Items[i])
            }
        }
    })
    $scope.getData("employees/simple/type", function (response) {
        $scope.employeeType = response;
    })
    $scope.$on('loadPersonnel', function (evt, data) {
        $scope.currentPath = "personnel";
        $scope.currentPage = 1;
        $scope.clearFilter();
        $scope.getTableData('personnel')
    })
    $scope.$on('searchPersonnel', function (evt, data) {
        $scope.currentSearchPage = 1;
        $scope.searchItem = data.data;
        $scope.currentSearch = "personnel/auto?q=" + $scope.searchItem
        $scope.getTableDataSearch($scope.currentSearch + "&&pn=" + $scope.currentSearchPage, data)
    })
    $scope.loadPageSearch = function (method) {
        if (method == 1) {
            if (!$scope.searchTableData.LastPage) {
                var page = Number($scope.searchTableData.PageIndex) + 1;
                $scope.currentSearchPage = page;
                newPath = $scope.currentSearch + "&&pn=" + page;
                $scope.getTableDataSearch(newPath);

            }
        } else if (method == -1) {
            if ($scope.searchTableData.PageIndex > 1) {
                var page = Number($scope.searchTableData.PageIndex) - 1;
                $scope.currentSearchPage = page;
                newPath = $scope.currentSearch + "&&pn=" + page;
                $scope.getTableDataSearch(newPath);

            }
        } else if (method == "first") {
            var page = 1;
            $scope.currentSearchPage = 1;
            newPath = $scope.currentSearch + "&&pn=" + page;
            $scope.getTableDataSearch(newPath);
        } else {
            var page = $scope.searchTableData.TotalPages;
            $scope.currentSearchPage = page;
            newPath = $scope.currentSearch + "&&pn=" + page;
            $scope.getTableDataSearch(newPath);
        }
    }
    $scope.loadPage = function (method) {
        if (method == 1) {
            if (!$scope.tableData.LastPage) {
                var page = Number($scope.tableData.PageIndex) + 1;
                $scope.currentPage = page;
                newPath = $scope.currentPath + "?pn=" + page + $scope.searchParam;
                $scope.getTableData(newPath);

            }
        } else if (method == -1) {
            if ($scope.tableData.PageIndex > 1) {
                var page = Number($scope.tableData.PageIndex) - 1;
                $scope.currentPage = page;
                newPath = $scope.currentPath + "?pn=" + page + $scope.searchParam;
                $scope.getTableData(newPath);

            }
        } else if (method == "first") {
            var page = 1;
            $scope.currentPage = 1;
            newPath = $scope.currentPath + "?pn=" + page + $scope.searchParam;
            $scope.getTableData(newPath);
        } else {
            var page = $scope.tableData.TotalPages;
            $scope.currentPage = page;
            newPath = $scope.currentPath + "?pn=" + page + $scope.searchParam;
            $scope.getTableData(newPath);
        }
    }
    $scope.getTableDataState = function (path) {
        $scope.getData(path, function (response) {
            $scope.stateArray = response;
        })
    }
    $scope.stateSearch = ""
    $scope.loadPageS = function (method) {
        if (method == 1) {
            if (!$scope.stateArray.LastPage) {
                var page = Number($scope.stateArray.PageIndex) + 1;
                // $scope.currentPage = page;
                newPath = $scope.statePath + page + "&search.q=" + $scope.stateSearch
                $scope.getTableDataState(newPath);

            }
        } else if (method == -1) {
            if ($scope.stateArray.PageIndex > 1) {
                var page = Number($scope.stateArray.PageIndex) - 1;
                // $scope.currentPage = page;
                newPath = $scope.statePath + page + "&search.q=" + $scope.stateSearch
                $scope.getTableDataState(newPath);

            }
        } else if (method == "first") {
            var page = 1;
            // $scope.currentPage = 1;
            newPath = $scope.statePath + page + "&search.q=" + $scope.stateSearch
            $scope.getTableDataState(newPath);
        } else {
            var page = $scope.stateArray.TotalPages;
            // $scope.currentPage = page;
            newPath = $scope.statePath + page + "&search.q=" + $scope.stateSearch
            $scope.getTableDataState(newPath);
        }
    }
    $scope.changePageSearch = function (event, page) {
        $("form").submit(function () { return false; });
        if (event.keyCode == 13) {
            if (page <= $scope.searchTableData.TotalPages && page >= 1) {
                $scope.currentSearchPage = page;
                newPath = $scope.currentSearch + "&&pn=" + page;
                $scope.getTableDataSearch(newPath);
            } else {
                $("#paging").val("");
            }
        }
    }
    $scope.changePage = function (event, page) {
        $("form").submit(function () { return false; });
        if (event.keyCode == 13) {
            if (page <= $scope.tableData.TotalPages && page >= 1) {
                $scope.currentPage = page;
                newPath = $scope.currentPath + "?pn=" + page + $scope.searchParam;
                $scope.getTableData(newPath);
                $("#pagingD").val("");
            } else {
                $("#pagingD").val("");
            }
        }
    }
    $scope.selectedPersonnel = function (personnel) {
        var dataToSet = [personnel]
        localStorage.setItem("lastSelected", JSON.stringify(dataToSet));
        $scope.setPersonnel(personnel, 1);
    }
    $scope.setPersonnelModal = function (personnel) {
        var dataToSet = [personnel]
        localStorage.setItem("lastSelected", JSON.stringify(dataToSet));
        $scope.searchItems = {
            name: "",
            family: "",
            fatherName: "",
            nationalCode: "",
            birthCode: "",
            personnelCode: "",
            employeeCode: "",
            sex: "",
            tri: null,
            treeName: null,
            marrige: [],
            ageFrom: "",
            ageUntil: "",
            warStatus: [],
            serviceStatus: [],
            employeeStatus: [],
            jobType: [],
            employmentFrom: "",
            employmentUntil: "",
            childrenCountFrom: "",
            childrenCountUntil: ""
        }
        $scope.setPersonnel(personnel, 2);
    }

    $scope.changeSearchTable = function () {
        var searchParameter = '';
        if ($scope.searchItems.name != "") {
            searchParameter = "&&search.n=" + $scope.searchItems.name
        }
        if ($scope.searchItems.family != "") {
            searchParameter = searchParameter + "&&search.f=" + $scope.searchItems.family
        }
        if ($scope.searchItems.personnelCode != "") {
            searchParameter = searchParameter + "&&search.pnn=" + $scope.searchItems.personnelCode
        }
        if ($scope.searchItems.employeeCode != "") {
            searchParameter = searchParameter + "&&search.dn=" + $scope.searchItems.employeeCode
        }
        $scope.searchParam = searchParameter;
        $scope.currentPage = 1;
        $scope.getTableData($scope.currentPath + "?pn=1" + searchParameter)
    }
    $scope.marigeStatus = [];
    $scope.openMarige = function () {
        if ($scope.marigeStatus.length == 0) {
            $scope.getData("constants/enum/MaritalState", function (response) {
                $scope.marigeStatus = response;
            })
        }
    }
    $scope.warStatus = [];
    $scope.openWar = function () {
        if ($scope.warStatus.length == 0) {
            $scope.getData("scores/war/types", function (response) {
                $scope.warStatus = response;
            })
        }
    }
    $scope.jobStatus = [];
    $scope.openJob = function () {
        if ($scope.jobStatus.length == 0) {
            $scope.getData("constants/enum/JobType", function (response) {
                $scope.jobStatus = response;
            })
        }
    }
    $scope.MarigeStateChange = function (item) {
        if ($("#check-m-" + item.Id).is(':checked')) {
            $scope.searchItems.marrige.push(item);
        } else {
            for (var i = 0; i < $scope.searchItems.marrige.length; i++) {
                if (item.Id == $scope.searchItems.marrige[i].Id) {
                    $scope.searchItems.marrige.splice(i, 1);
                }
            }
        }
    }
    $scope.serviceStateChange = function (item) {
        if ($("#check-s-service-" + item.Id).is(':checked')) {
            $scope.searchItems.serviceStatus.push(item);
        } else {
            for (var i = 0; i < $scope.searchItems.serviceStatus.length; i++) {
                if (item.Id == $scope.searchItems.serviceStatus[i].Id) {
                    $scope.searchItems.serviceStatus.splice(i, 1);
                }
            }
        }
    }
    $scope.removeService = function (index, id) {
        $scope.searchItems.serviceStatus.splice(index, 1);
        $("#check-s-service-" + id).prop("checked", false);
    }
    $scope.removeEmployee = function (index, id) {
        $scope.searchItems.employeeStatus.splice(index, 1);
    }
    $scope.eStateChange = function (item) {
        if ($("#check-e-" + item.Id).is(':checked')) {
            $scope.searchItems.employeeStatus.push(item);
        } else {
            for (var i = 0; i < $scope.searchItems.employeeStatus.length; i++) {
                if (item.Id == $scope.searchItems.employeeStatus[i].Id) {
                    $scope.searchItems.employeeStatus.splice(i, 1);
                }
            }
        }
    }
    $scope.checkingState = function (item) {
        var found = false;
        for (var i = 0; i < $scope.searchItems.employeeStatus.length; i++) {
            if (item.Id == $scope.searchItems.employeeStatus[i].Id) {
                found = true;
                break
            }
        }
        return found;
    }
    $scope.warStateChange = function (item) {
        if ($("#check-w-war-" + item.Id).is(':checked')) {
            $scope.searchItems.warStatus.push(item);
        } else {
            for (var i = 0; i < $scope.searchItems.warStatus.length; i++) {
                if (item.Id == $scope.searchItems.warStatus[i].Id) {
                    $scope.searchItems.warStatus.splice(i, 1);
                }
            }
        }
    }
    $scope.removeWar = function (index, id) {
        $scope.searchItems.warStatus.splice(index, 1);
        $("#check-w-war-" + id).prop("checked", false);
    }
    $scope.jobStateChange = function (item) {
        if ($("#customCheck-work-" + item.Id).is(':checked')) {
            $scope.searchItems.jobType.push(item);
        } else {
            for (var i = 0; i < $scope.searchItems.jobType.length; i++) {
                if (item.Id == $scope.searchItems.jobType[i].Id) {
                    $scope.searchItems.jobType.splice(i, 1);
                }
            }
        }
    }
    $scope.removeJob = function (index, id) {
        $scope.searchItems.jobType.splice(index, 1);
        $("#customCheck-work-" + id).prop("checked", false);
    }
    $scope.submitFilter = function () {
        // serviceStatus:"",
        // employeeStatus:"",
        var searchParameter = '';
        if ($scope.searchItems.name != "") {
            searchParameter = "&&search.n=" + $scope.searchItems.name
        }
        if ($scope.searchItems.family != "") {
            searchParameter = searchParameter + "&&search.f=" + $scope.searchItems.family
        }
        if ($scope.searchItems.fatherName != "") {
            searchParameter = searchParameter + "&&search.fn=" + $scope.searchItems.fatherName
        }
        if ($scope.searchItems.nationalCode != "") {
            searchParameter = searchParameter + "&&search.nc=" + $scope.searchItems.nationalCode
        }
        if ($scope.searchItems.personnelCode != "") {
            searchParameter = searchParameter + "&&search.pnn=" + $scope.searchItems.personnelCode
        }
        if ($scope.searchItems.employeeCode != "") {
            searchParameter = searchParameter + "&&search.dn=" + $scope.searchItems.employeeCode
        }
        if ($scope.searchItems.ageFrom != "") {
            searchParameter = searchParameter + "&&search.ag1=" + $scope.searchItems.ageFrom
        }
        if ($scope.searchItems.ageUntil != "") {
            searchParameter = searchParameter + "&&search.ag2=" + $scope.searchItems.ageUntil
        }
        if ($scope.searchItems.childrenCountFrom != "") {
            searchParameter = searchParameter + "&&search.cf=" + $scope.searchItems.childrenCountFrom
        }
        if ($scope.searchItems.childrenCountUntil != "") {
            searchParameter = searchParameter + "&&search.cu=" + $scope.searchItems.childrenCountUntil
        }
        if ($scope.searchItems.sex != "" && $scope.searchItems.sex != 0) {
            searchParameter = searchParameter + "&&search.gn=" + $scope.searchItems.sex
        }
        if ($("#from").val() != '') {
            searchParameter = searchParameter + "&&search.efd=" + $("#from").val()
        }
        if ($("#until").val() != '') {
            searchParameter = searchParameter + "&&search.eud=" + $("#until").val()
        }
        if ($scope.searchItems.tri != null) {
            searchParameter = searchParameter + "&&search.tri=" + $scope.searchItems.tri
        }
        if ($scope.searchItems.marrige.length != 0) {
            var mValue = 0
            for (var i = 0; i < $scope.searchItems.marrige.length; i++) {
                mValue = mValue + $scope.searchItems.marrige[i].Id
            }
            searchParameter = searchParameter + "&&search.ms=" + mValue;
        }
        if ($scope.searchItems.warStatus.length != 0) {
            var wValue = 0
            for (var i = 0; i < $scope.searchItems.warStatus.length; i++) {
                wValue = wValue + $scope.searchItems.warStatus[i].Id
            }
            searchParameter = searchParameter + "&&search.wt=" + wValue;
        }
        if ($scope.searchItems.jobType.length != 0) {
            var jValue = 0
            for (var i = 0; i < $scope.searchItems.jobType.length; i++) {
                jValue = jValue + $scope.searchItems.jobType[i].Id
            }
            searchParameter = searchParameter + "&&search.jt=" + jValue;
        }
        if ($scope.searchItems.serviceStatus.length != 0) {
            var jValue = $scope.searchItems.serviceStatus[0].Id
            for (var i = 1; i < $scope.searchItems.serviceStatus.length; i++) {
                jValue = jValue + "," + $scope.searchItems.serviceStatus[i].Id
            }
            searchParameter = searchParameter + "&&search.et=" + jValue;
        }
        if ($scope.searchItems.employeeStatus.length != 0) {
            var jValue = $scope.searchItems.employeeStatus[0].Id
            for (var i = 1; i < $scope.searchItems.employeeStatus.length; i++) {
                jValue = jValue + "," + $scope.searchItems.employeeStatus[i].Id
            }
            searchParameter = searchParameter + "&&search.es=" + jValue;
        }
        $scope.searchParam = searchParameter;
        $scope.currentPage = 1;
        $scope.getTableData($scope.currentPath + "?pn=1" + searchParameter)
    }
    $scope.clearFilter = function () {
        $scope.searchItems = {
            name: "",
            family: "",
            fatherName: "",
            nationalCode: "",
            birthCode: "",
            personnelCode: "",
            employeeCode: "",
            sex: "",
            tri: null,
            treeName: null,
            marrige: [],
            ageFrom: "",
            ageUntil: "",
            warStatus: [],
            serviceStatus: [],
            employeeStatus: [],
            jobType: [],
            employmentFrom: "",
            employmentUntil: "",
            childrenCountFrom: "",
            childrenCountUntil: ""
        }
        $("#from").val('');
        $("#until").val('');
        $scope.currentPage = 1;
        $("#selectPersonnel .custom-control-input").prop("checked", false);
        $scope.getTableData($scope.currentPath + "?pn=1")
    }
    $('.dropdown').on({
        "click": function (event) {
            if ($(event.target).closest('.dropdown-toggle').length) {
                $(this).data('closable', true);
            } else {
                $(this).data('closable', false);
            }
        },
        "hide.bs.dropdown": function (event) {
            hide = $(this).data('closable');
            $(this).data('closable', true);
            return hide;
        }
    });


    //this is testldkflskdjfklsjkldfjklsdfklsdklfjkljdf
    $scope.localStatus = false;
    $scope.getLocalPersonnel = function () {
        $scope.localStoragePersonnel = localStorage.getItem("localPersonnelItem")
        if ($scope.localStoragePersonnel == null) {
            $scope.localStatus = true;
        } else {
            $scope.storagedPersonnel = JSON.parse($scope.localStoragePersonnel);
        }
    }
    $scope.changeSelectPostStatus = function () {
        $("form").submit(function () { return false; });
        if ($scope.selectPostStatus) {
            $scope.selectPostStatus = false;
        } else {
            $scope.selectPostStatus = true;
        }
    }
    $scope.settingChart = function (item) {
        $scope.selectPostStatus = false;
        // console.log(item);
        $scope.searchItems.tri = item.Id;
        $scope.searchItems.treeName = item.Title
    }
    $scope.clearChart = function () {
        $scope.searchItems.tri = null;
        $scope.searchItems.treeName = null
    }
}])