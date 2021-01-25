var app = angular.module('myApp');
app.controller('organizationSelectController', ['$scope', '$http', '$compile', '$timeout', '$rootScope', 'currencyConverter', function ($scope, $http, $compile, $timeout, $rootScope, currencyConverter) {
    // $scope.include = 'organization.html';
    $('[data-toggle="tooltip"]').tooltip();
    // console.log(window.location.toString().split("/")[3])
    // if (window.location.toString().split("/")[3] == "Organization" || window.location.toString().split("/")[3] == "Kargozini" || window.location.toString().split("/")[3] == "EvaluatinForm" || window.location.toString().split("/")[3] == "Personnels" || window.location.toString().split("/")[3] == "PersonnelActionForm" || window.location.toString().split("/")[3] == "GlobalValue") {
    //     $scope.path = "http://" + window.location.toString().split("/")[2] + "/api/";
    // } else {
    //     $scope.path = "http://" + window.location.toString().split("/")[2] + "/" + window.location.toString().split("/")[3] + "/api/";
    // }
    // console.log(window.location.toString().split("/")[3])
    $scope.path = "http://localhost:57347/api/"
    $scope.getOfficialPositions = function () {
        $scope.chargesData = [];
        var route = "charts/" + $scope.editingRow.ChartId + "/charges"
        $scope.getData(route, function (data) {
            $scope.chargesData = data;
            $scope.createPaginationCharges(Math.ceil(data[0].TotalRow / 10))
        })
    }
    $scope.editingRow = {}
    // $scope.getAddress = function () {
    //     var route = "Addresses/" + $scope.editBranch.AddressId
    //     $scope.getData(route, function (data) {
    //         $scope.address = data;
    //     })
    // }
    $scope.getData = function (route, callback) {
        $http({
            url: $scope.path + route,
            method: "GET",
            ContentType: "application/json; charset = utf-8",
            dataType: 'JSON',
        })
            .then(function (response) {
                callback(response.data);
                // console.log(response.data);
            })
            .catch(function (xhr) {
                // callback(xhr.data);
            })
    }
    $scope.mainTableData = [];
    $scope.breadCrumbs = [];

    // $scope.getData("constants/chartKind/Post", function (response) {
    //     $scope.postType = response;
    // })
    // $scope.getData("constants/chartKind/Unit", function (response) {
    //     $scope.unitType = response;
    // })
    // $scope.getData("unittypes", function (response) {
    //     $scope.unknownType = response;
    // })
    $scope.currentRoute = "charts";
    $scope.getChildrenData = function (id) {
        var route = "charts/" + id + "/children";
        $scope.currentRoute = route;
        $scope.getData(route, function (data) {
            $scope.mainTableData = data[0].Charts;
            $scope.breadCrumbs = data[0].ChartBreadCrumb;
            $scope.createPagination(Math.ceil(data[0].TotalRow / 10));
        })
    }
    $scope.showingChart = function () {
        $scope.chartLoading = true;
        var route = $scope.currentRoute + "/all";
        $scope.getData(route, function (data) {
            $scope.chartLoading = false;
            $scope.chartData = data;
            $("#chart").modal("show");
        })
    }
    $scope.showOrganizationTree = function () {
        $scope.treePage = 'organizationTree.html'
        $("#tree").modal("show");
    }
    $scope.nodes = [];
    $scope.totalNodes = [];
    $scope.getTreeRootNode = function () {
        var route = "charts/all";
        $scope.getData(route, function (node) {
            $scope.nodes = node;
            $scope.totalNodes = node;
        })
    }
    $scope.getSubNode = function (id) {
        // console.log($("#tree-" + id + ":empty").length);
        // check this for length
        if ($("#tree-select-" + id + ":empty").length == 1 || $("#tree-" + id + ":empty").length == 2) {
            var route = "charts/" + id + "/children/all";
            $scope.getData(route, function (node) {
                $scope.makingTreeNode(id, node)
            })
        } else {
            $("#tree-select-" + id).slideToggle();
        }
    }
    $scope.selectingNode = function (id) {
        for (var i = 0; i < $scope.totalNodes.length; i++) {
            if (id == $scope.totalNodes[i].ChartId) {
                $scope.settingChart($scope.totalNodes[i]);
                break;
            }
        }
    }
    $scope.getTableData = function () {
        $scope.getData($scope.currentPath + "&pn=" + $scope.currentPage, function (response) {
            $scope.searchLoading = false;
            if (response != 404) {
                $scope.searchResult = response;
            }
        })
    }
    $scope.loadPage = function (type) {
        if ($scope.searchResult.length != 0) {
            if (type == 'last') {
                $scope.currentPage = $scope.TotalPages;
                $scope.getTableData()
            }
            else if (type == 'first') {
                $scope.searching();
            } else if (type == 1) {
                if ($scope.currentPage < $scope.TotalPages) {
                    $scope.currentPage++;
                    $scope.getTableData()
                }
            } else {
                if ($scope.currentPage > 1) {
                    $scope.currentPage--;
                    $scope.getTableData()
                }
            }
        }
    }
    $scope.selectingNode1 = function (id) {
        $scope.searchParam = {
            q: '',
            cd: '',
            uc: ''
        }
        $scope.settingChart(id);
    }
    $scope.searchParam = {
        q: '',
        cd: '',
        uc: ''
    }
    $scope.searching = function () {
        $scope.searching = function () {
            // console.log($scope.searchParam)
            $scope.searchLoading = true;
            // console.log($("#periodDate").val());
            if ($scope.pageName != undefined) {
                $scope.currentPath = "charts/group?search.cd=" + $scope.searchParam.cd + "&search.q=" + $scope.searchParam.q + "&search.uc=" + $scope.searchParam.uc + "&search.ss=" + $("#periodDate").val()
            } else {

                $scope.currentPath = "charts/group?search.cd=" + $scope.searchParam.cd + "&search.q=" + $scope.searchParam.q + "&search.uc=" + $scope.searchParam.uc
            }
            $scope.getData($scope.currentPath, function (response) {
                console.log(response);
                $scope.searchLoading = false;
                if (response != 404) {
                    $scope.searchResult = response;
                    $scope.currentPage = 1;
                    $scope.TotalPages = Math.ceil($scope.searchResult[0].TotalRow / 10);
                } else {
                    $scope.searchResult = [];
                    $scope.currentPage = 0;
                    $scope.TotalPages = 0;
                }
            })
        }
    }
    $scope.setTable = function (result, node) {
        $scope.searchParam = {
            q: '',
            cd: '',
            uc: ''
        }
        $scope.loadTree(result.BreadCrumb, node)
    }
    $scope.makingTreeNode = function (id, data) {
        // console.log(data);
        for (var i = 0; i < data.length; i++) {
            $scope.totalNodes.push(data[i]);
            $("#tree-select-" + id).append(
                $compile(
                    "<li>\
                        <div  class='li-info asp-label'>\
                        <span class='user-span' data-toggle='tooltip' title='دارای تصدی'  ng-if='" + data[i].HasPersonnel + "' id='user-" + data[i].ChartId + "' ><i class='fa fa-user'></i></span>\
                            <i class='fa fa-building' id='icon-" + data[i].ChartId + "' ng-if='" + data[i].IsOraganization + "'  ng-click='getSubNode(" + data[i].ChartId + ")'></i>\
                            <i class='fa fa-address-card' id='icon-" + data[i].ChartId + "' ng-if='" + data[i].IsPost + "'></i>\
                            <i class='fa fa-users' id='icon-" + data[i].ChartId + "' ng-if='" + !data[i].IsOraganization + "&&" + !data[i].IsPost + "'  ng-click='getSubNode(" + data[i].ChartId + ")'></i>\
                            <input type='radio' ng-if='!selectMultiChart' ng-click='selectingNode("+ data[i].ChartId + ")' name='chart id='radio-" + data[i].ChartId + "' >\
                            <input type='checkbox' ng-if='selectMultiChart' ng-click='addToChartList("+ data[i].ChartId + ")' name='chart id='check-" + data[i].ChartId + "' >\
                            <span>" + data[i].Title + "\
                            </span >\
                        </div>\
                        <ul id='tree-select-" + data[i].ChartId + "'></ul>\
                    </li> "
                )($scope)
            )
            // if(data[i].IsPost) {
            //     $("#plus-" + data[i].ChartId).css("display","none");
            // }
        }
        $('[data-toggle="tooltip"]').tooltip();
        $("#tree-select-" + id).slideToggle();
        // console.log("thi ssldkfslkd")
    }
    $scope.dropdownChart = function (id) {

        if ($('#chart-select-' + id).is(':empty')) {
            $scope.childrenLoading = true;
            var route = "charts/" + id + "/children/all";
            $scope.getData(route, function (data) {
                $scope.arrayToCreateChart = data;
                $scope.childrenLoading = false;
                $scope.appendingChart(id);
                $timeout(function () {
                    $('#icon-' + id).addClass("rotate-up");
                }, 500)
            })
        } else {
            $('#chart-select-' + id).toggle();
            $('#icon-' + id).toggleClass("rotate-up");
        }
    }
    $scope.appendingChart = function (idToAdd) {
        for (var i = 0; i < $scope.arrayToCreateChart.length; i++) {
            if (!$scope.arrayToCreateChart[i].IsPost) {
                $("#chart-select-" + idToAdd).append(
                    $compile(
                        "<li>\
                            <span title='" + $scope.arrayToCreateChart[i].Title + "'>\
                                <span>" + $scope.arrayToCreateChart[i].Title + "\
                                </span >\
                                <i class='fa fa-chevron-down' id='icon-" + $scope.arrayToCreateChart[i].ChartId + "' ng-if='!childrenLoading && " + $scope.arrayToCreateChart[i].HasNonPostChildren + "' ng-click='dropdownChart(" + $scope.arrayToCreateChart[i].ChartId + ")'></i>\
                                <div class='spinner-border text-primary spinner-border-sm' role='status' ng-if='childrenLoading'>\
                                    <span class='sr-only'>Loading...</span>\
                                </div>\
                            </span>\
                            <ul id='chart-select-" + $scope.arrayToCreateChart[i].ChartId + "'></ul>\
                        </li> "
                    )($scope)
                )
            }
        }
    }
    $scope.createModalType = "";
    $scope.ParentIdToCreate = null;
    $scope.locationChoosing = false;
    
}])