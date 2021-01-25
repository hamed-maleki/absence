var app = angular.module('myApp', []);
app.directive("importSheetJs", function () {
    return {
        link: function (scope, $elm, $attrs) {
            $elm.on('change', function (changeEvent) {
                var X = XLSX;
                var reader = new FileReader();
                reader.onload = function (e) {
                    var bstr = e.target.result;
                    var workbook = XLSX.read(bstr, { type: 'binary' });
                    var result = {};
                    var allSheet = [];
                    workbook.SheetNames.forEach(function (sheetName) {
                        var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                        allSheet.push(roa);

                        if (roa.length) result[sheetName] = roa;
                    });
                    scope.importPassData(allSheet);
                };

                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    };
})
app.controller('importCtrl', function ($scope, $http) {
    $scope.fileData = [];
    $scope.fileOrder = [
        {
            title:"نام کارمند",
            id:1
        },
        {
            title:"تاریخ",
            id:2
        },
        {
            title:"ساعت ورود",
            id:3
        },
        {
            title:"ساعت خروج",
            id:4
        },
        {
            title:"نوع تردد",
            id:5
        },
    ];
    $scope.importPassData = function(data) {
        $scope.orderedData = [null,null,null,null,null]
        $scope.fileData = data;
        console.log($scope.fileData);
    }
    $scope.showModalForConfirm = function(){
        
        $("#dataModal").modal();
    }
    $scope.setDatePicker = function() {
       setTimeout(function(){
           $(".date-picker").datepicker({
               dateFormat: "yy/mm/dd",
               changeMonth: true,
               changeYear: true
           });
       },100)
    }
    $scope.cacnelShowingData = function(){
        $("#dataModal").modal('hide');
    }
    $scope.confirmData = function(){
        $("#dataModal").modal('hide');
    }
})