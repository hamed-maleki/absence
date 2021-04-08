var app = angular.module('myApp', ['customService', 'finance3']);
app.controller('personnelTrafficDailyReportCtrl', ["$scope", "$timeout", 'currencyConverter', 'requests', function ($scope, $timeout, currencyConverter, requests) {
    $scope.searchBtn = false;
    $scope.err = false;
    $scope.showSearch = false;
    $scope.showList = false;
    $scope.loadingPersonnel = false;
    $scope.selectPersonnelsFromDb = [];
    $scope.PersonnelIds = [];
    $scope.selectPersonnelFromDbArray = [];
    //----------- toggeler list bar ----------------
    $scope.showListStatus = function () {
        if ($scope.showList == false) {
            $scope.loadingPersonnel = true;
            $scope.selectPersonnel();
        }
    }
    $('#collapsePersonnelList').on('shown.bs.collapse', function () {
        $("#toggleIcon").addClass('fa-arrow-up');
        $("#toggleIcon").removeClass('fa-arrow-down');
    });

    $('#collapsePersonnelList').on('hidden.bs.collapse', function () {
        $("#toggleIcon").removeClass('fa-arrow-up');
        $("#toggleIcon").addClass('fa-arrow-down');
    });
    //============= date picker==================

    $timeout(function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
    }, 500)
    //=============== convert date to shamsi =============================
    $scope.convertToShamsi = function (date) {
        if (date != null) {
            return moment(date, 'YYYY/M/D').format('jYYYY/jMM/jDD');
        } else {
            return "-"
        }
    }
    //=============== convert date to miladi =============================
    $scope.convertToMiladi = function (date) {
        if (date != null) {
            return moment(date, 'jYYYY/jM/jD').format('YYYY-MM-DD');
        } else {
            return "-"
        }
    }
    //------------- load page -----------------------
    $scope.reportPages = function (page) {
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
            if ($scope.report.item3 + 1 <= $scope.reports.totalPage) {
                item.pageNumber = $scope.reports.item3 + 1;
                $scope.getReportList(item);
            }
        } else if (page == -1) {
            if ($scope.reports.item3 - 1 > 0) {
                item.pageNumber = $scope.reports.item3 - 1;
                $scope.getReportList(item);
            }

        } else if (page == "first") {
            item.pageNumber = 1;
            $scope.getReportList(item);

        } else {
            item.pageNumber = $scope.reports.totalPage;
            $scope.getReportList(item);
        }
    }
    //================== search and get personnel ===============================
    $scope.personnelInfoExist = false;
    $scope.moreThanOnePersonnel = false;
    $scope.IsPersonelRemoved = false;

    $scope.searchP = {
        value: null
    }

    $scope.selectMulti = true;
    $scope.openPersonnel = function () {
        $(".date-picker").datepicker({
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            changeYear: true
        });
        $("#addingPersonnelModal").modal();
        $scope.loadingPersonnel = true;
        $timeout(function () {
            currencyConverter.call()
        }, 100)
    }

    $scope.cancelAddingPersonnel = function () {
        $("#addingPersonnelModal").modal("hide");
        $scope.loadingPersonnel = false;
    }

    $('.dropdownInMission').on({
        "click": function (event) {
            if ($(event.target).closest('.dropdown-toggle').length) {
                $(this).data('closable', true);
            } else {
                $(this).data('closable', false);
            }
        },
        "hide.bs.dropdownInMission": function (event) {
            hide = $(this).data('closable');
            $(this).data('closable', true);
            return hide;
        }
    });
    $scope.addToMutliPerSetAll = function (item) {
        $scope.selectPersonnelsFromDb.push(item);
    }
    $scope.checkMulti = function (id) {
        var found = false;
        for (var i = 0; i < $scope.selectPersonnelsFromDb.length; i++) {
            if ($scope.selectPersonnelsFromDb[i].Id == id) {
                found = true;
                break;
            }
        }
        return found;
    }
    $scope.setAllPersonnel = function () {
        $scope.selectPersonnelsFromDb = [];
        if ($scope.setAll) {
            $scope.setAll = false
        } else {
            $scope.setAll = true;
            $scope.$broadcast("changingMulti")
        }
    }
    $scope.selectPersonnel = function () {
        $scope.localPersonnel = false;
        $scope.showPersonnel = true;
        setTimeout(function () {
            currencyConverter.call()
        }, 10)
    }
    $scope.settingPersonnelInfo = function (data) {
        localStorage.setItem("lastSelected", JSON.stringify(data));
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

    $scope.confirmAllPersonnel = function (item) {
        // console.log(item.length)
        for (let i = 0; i < item.length; i++) {
            $scope.PersonnelIds.push(item[i].Id);
        }
        localStorage.setItem('MultiSelectionPersonnel', JSON.stringify(item));
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
            localStorage.setItem("localPersonnelItem", JSON.stringify(dataLocal));
        }

        $scope.loading = true;
        $scope.settingPersonnelInfo(data);
        if ($scope.IsPersonelRemoved == true) {
            $scope.selectPersonnelsFromDb = JSON.parse(localStorage.getItem('MultiSelectionPersonnel'));
            $scope.selectPersonnelsFromDb.push(data);
            localStorage.setItem('MultiSelectionPersonnel', JSON.stringify($scope.selectPersonnelsFromDb));
        } else {
            $scope.selectPersonnelsFromDb.push(data);
            localStorage.setItem('MultiSelectionPersonnel', JSON.stringify($scope.selectPersonnelsFromDb));
        }
        if (method == "1") {
            $scope.selectPersonnelFromDbArray = JSON.parse(localStorage.getItem('MultiSelectionPersonnel'));
            $scope.localPersonnel = false;
            for (let i = 0; i < $scope.selectPersonnelFromDbArray.length; i++) {
                $scope.PersonnelIds.push($scope.selectPersonnelFromDbArray[i].Id);
            }
            if ($scope.selectPersonnelFromDbArray.length != 0) {
                $scope.personnelInfoExist = true;
            }
            if ($scope.selectPersonnelFromDbArray.length > 1) {
                $scope.moreThanOnePersonnel = true;
            }
        }
    }
    $scope.confirmAddingPersonnel = function () {
        $scope.PersonnelIds = [];
        $scope.selectPersonnelFromDbArray = JSON.parse(localStorage.getItem('MultiSelectionPersonnel'));
        for (let i = 0; i < $scope.selectPersonnelFromDbArray.length; i++) {
            $scope.PersonnelIds.push($scope.selectPersonnelFromDbArray[i].Id);
        }
        if ($scope.selectPersonnelFromDbArray.length != 0) {
            $scope.personnelInfoExist = true;
        }
        if ($scope.selectPersonnelFromDbArray.length > 1) {
            $scope.moreThanOnePersonnel = true;
        }
        $("#collapsePersonnelList").removeClass('show');
        $("#toggleIcon").removeClass('fa-arrow-up');
        $("#toggleIcon").addClass('fa-arrow-down');
        $scope.showSearch = true;
    }
    $scope.CancelAddPersonnel = function () {
        $scope.showList = false;
        $scope.loadingPersonnel = false;
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
    //-------------- search button -----------------------
    $scope.searching = function () {
        $scope.fromDate = $scope.convertToMiladi($('#fromDate').val())
        $scope.toDate = $scope.convertToMiladi($('#toDate').val());
        $scope.getReportList();
    }
    //------------- get list of work settings -----------------------
    $scope.getReportList = function () {
        $scope.searchBtn = true;
        $scope.item = {
            fromDate: $scope.convertToMiladi($('#fromDate').val()),
            toDate: $scope.convertToMiladi($('#toDate').val()),
            fromDatePersian: $('#fromDate').val(),
            toDatePersian: $('#toDate').val(),
            personIds: $scope.PersonnelIds,
            formatType: parseInt($('#formatType').val()),
            dayStatus: parseInt($('#dayStatus').val()),
            isLinerReport: false
        }
        $scope.reports = [];
        requests.postingData("Reports/GetDailyCalculatedReport", $scope.item, function (response) {
            if (response.success == true) {
                $scope.reports = response.data;

            } else {
                alert(response.errorMessages);
            }
        })
        console.log($scope.item);
    }
    $scope.fnExcelReport = function () {
        var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
        var textRange; var j = 0;
        tab = document.getElementById('tableHeader'); // id of table

        for (j = 0; j < tab.rows.length; j++) {
            tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
            //tab_text=tab_text+"</tr>";
        }

        tab_text = tab_text + "</table>";
        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
        tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
        {
            txtArea1.document.open("txt/html", "replace");
            txtArea1.document.write(tab_text);
            txtArea1.document.close();
            txtArea1.focus();
            sa = txtArea1.document.execCommand("SaveAs", true, "");
        }
        else                 //other browser not tested on IE 11
            sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

        return (sa);
    }
    $scope.saveReportPdf = function () {
        $scope.item = {
            fromDate: $scope.convertToMiladi($('#fromDate').val()),
            toDate: $scope.convertToMiladi($('#toDate').val()),
            fromDatePersian: $('#fromDate').val(),
            toDatePersian: $('#toDate').val(),
            personIds: $scope.PersonnelIds,
            formatType: parseInt($('#formatType').val()),
            dayStatus: parseInt($('#dayStatus').val()),
            isLinerReport: false
        }
        requests.postingData("Reports/GetDailyCalculatedReportStimule", $scope.item, function (response) {
            if (response.success == true) {
                console.log(response.data);
                var report = new Stimulsoft.Report.StiReport();
                console.log(report);
                report.loadFile($scope.reportsStimule);
                report.exportDocumentAsync((pdfData) => {
                    // Converting Array into buffer
                    var buffer = Buffer.from(pdfData)

                    // File System module
                    var fs = require('fs');

                    // Saving string with rendered report in PDF into a file
                    fs.writeFileSync('./SimpleList.pdf', buffer);
                    console.log("Rendered report saved into PDF-file.");
                }, Stimulsoft.Report.StiExportFormat.Pdf);
            } else {
                alert(response.errorMessages);
            }
        })

    }
}])