var app = angular.module('myApp', ['customService','finance3']);
app.controller('enterCtrl', function ($scope, $http, currencyConverter,requests) {
    $scope.searchP = {
        value: null
    };
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
    $scope.customMonth = [];
    $scope.oneSelected = false;
    $scope.searchingPositionChange = function () {
        $scope.searchingPosition = false;
        $scope.searchP.value = null;
    }
    $scope.filterItems = [
        {
            title:"عادی",
            selected:false,
            id:1
        },
        {
            title:"از طریق کارت ساعت",
            selected:false,
            id:2
        },
        {
            title:"ورود دستی",
            selected:false,
            id:4
        },
        {
            title:"مرخصی",
            selected:false,
            id:8
        },
        {
            title:"ماموریت",
            selected:false,
            id:16
        },
        {
            title:"نرددهای ناقص",
            selected:false,
            id:32
        },
        {
            title:"روزهای فاقد تردد",
            selected:false,
            id:64
        },
    ]
    $scope.removeFilter = function(item) {
        item.selected = false;
    }
    
    $scope.serachPersonel = function (value) {
        // console.log(value);
        $scope.localPersonnel = false;
        if (value == "") {
            $scope.searchingPosition = false;
        } else {
            $scope.searchingPosition = true;
            currencyConverter.setSearch(value);
        }
    }
    $scope.selectPersonnel = function () {
        $scope.localPersonnel = false;
        $("#selectPersonnel").modal();
        $scope.loadingPersonnel = true;
        setTimeout(function () {
            currencyConverter.call()
        }, 500)
    }
    $scope.settingPersonnelInfo = function (data) {
        $scope.selectedPersonnel = data;
        localStorage.setItem("lastSelected", JSON.stringify(data));
        // for (var i = 0; i < 31; i++) {
        //     itemToAdd = {
        //         date: moment().add(i, 'days').format('jYYYY/jM/jD')
        //     }
        //     $scope.customMonth.push(itemToAdd);
        // }
        $scope.oneSelected = true;
        $scope.loading = false;
        setTimeout(function () {
            $(".date-picker").datepicker({
                dateFormat: "yy/mm/dd",
                changeMonth: true,
                changeYear: true
            });
            $("#finishEnterDate").val(moment().format('jYYYY/jM/jD'))
            $("#startEnterDate").val(moment().add(-30, 'days').format('jYYYY/jM/jD'));
            
        }, 100);
    }
    $scope.setPersonnel = function (data, method) {
        var dataLocal = localStorage.getItem("localPersonnelItem");
        if (dataLocal == null) {
            var itemToSet = [
                data
            ];
            localStorage.setItem("localPersonnelItem", JSON.stringify(itemToSet));
        } else {
            var flag = true;
            dataLocal = JSON.parse(dataLocal);
            for (var i = 0; i < dataLocal.length; i++) {
                if (data.Id == dataLocal[i].Id) {
                    flag = false;
                }
            }
            if (dataLocal.length > 2) {
                dataLocal.splice(2, 1);
            }
            if (flag) {
                dataLocal.unshift(data);
            }
            // var dataToShift = JSON.stringify(dataLocal);
            localStorage.setItem("localPersonnelItem", JSON.stringify(dataLocal));
        }
        $scope.localPersonnel = false;
        $scope.selectedPersonnel = data;
        if (data.Name == undefined) {
            $scope.searchP.value = data.PoliteName
        } else {
            $scope.searchP.value = data.Name + " " + data.Family;
            $("#personnel-input").val(data.Name + " " + data.Family)
        }
        $scope.searchingPosition = false;
        $scope.loading = true;
        $("#selectPersonnel").modal('hide');
        $scope.settingPersonnelInfo($scope.selectedPersonnel);
    }
    $scope.checkLocal = function () {
        if (localStorage.getItem("lastSelected") != null) {
            var data = localStorage.getItem("lastSelected");
            data = JSON.parse(data)
            $scope.settingPersonnelInfo(data[0]);

        } else {

            $scope.getTableData('personnel');
            $scope.notLocal = true;
        }
    }
    $scope.editTransporting = function(item) {
        $scope.editingItem = item;
        $('.time').wickedpicker({
            twentyFour: true,
            upArrow: 'fa fa-chevron-up',
            downArrow: 'fa fa-chevron-down'
        });
        $("#editEnterData").modal();
    }
    $scope.cancelEdit = function() {
        $("#editEnterData").modal('hide');
    }
    $scope.openExtra = function() {
        $("#additionalHours").modal();
    }
    $scope.cancelAdditional = function() {
        $("#additionalHours").modal('hide');
    }
    $scope.changeCheckingDate = function() {
        var itemToSend = 0;
        for(var i = 0; i< $scope.filterItems.length;i++) {
            if($scope.filterItems[i].selected){
                itemToSend = itemToSend + $scope.filterItems[i].id
            }
        }
        var startGergorain = moment($("#startEnterDate").val(), 'jYYYY/jM/jD').format('YYYY/MM/DD')
        var finishGergorain = moment($("#finishEnterDate").val(), 'jYYYY/jM/jD').format('YYYY/MM/DD')
        var path;
        if(itemToSend != 0) {
            path = "PersonRollCalls/GetListPersonRollCall/"+$scope.selectedPersonnel.Id+"?FromDt="+startGergorain+"&ToDt="+finishGergorain+"&Filter="+itemToSend
        }else {
            path = "PersonRollCalls/GetListPersonRollCall/"+$scope.selectedPersonnel.Id+"?FromDt="+startGergorain+"&ToDt="+finishGergorain+"&Filter=127"
        }
        requests.gettingData(path,function(response){
            // console.log(response);
            $scope.enteranceData = [];
            $scope.loadedData = true;
            var itemToOrder = response.data
            var counter = 0;
            while(counter < itemToOrder.length) {
                var itemtoAdd =  {
                    enter:itemToOrder[counter],
                    exit:null
                }
                if(itemToOrder[counter].rollcall.split("T")[0] == itemToOrder[counter + 1].rollcall.split("T")[0]) {
                    itemtoAdd.exit = itemToOrder[counter + 1];
                    counter = counter + 2;
                }else {
                    counter ++;
                }
                $scope.enteranceData.push(itemtoAdd);
            }
            console.table($scope.enteranceData);
        })
    }
})