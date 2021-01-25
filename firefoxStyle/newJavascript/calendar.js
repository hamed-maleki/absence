var app = angular.module('myApp');
app.controller("calendarCtrl", ["$scope", "$http", function ($scope, $http) {
   
    $scope.yearlyView = true
    $scope.setDate = function () {
        // var today = moment().format("YYYY/MM/DD")
        $scope.month = [];
        $scope.years = [];
        $scope.today = moment().format('jYYYY/jM/jD');
        $scope.todayMonth = $scope.today.split("/")[1]
        $scope.todayDay = $scope.today.split("/")[2]
        $scope.todayYear = $scope.today.split("/")[0]
        var firstDayOfMonth = $scope.today.split("/")[0] + "/" + $scope.today.split("/")[1] + "/1";
        $scope.currentMonth = Number($scope.today.split("/")[1]);
        $scope.currentYear = Number($scope.today.split("/")[0]);
        $scope.setGeneral($scope.currentYear, $scope.currentMonth);
        $scope.getYearHoliday($scope.currentYear)
        // $scope.getMonthHoliday($scope.currentMonth,$scope.currentYear)
        for (var i = 9; i > 0; i--) {
            var ite = {
                title: $scope.currentYear - i,
                val: $scope.currentYear - i
            }
            $scope.years.push(ite)
        }
        var item = {
            title: $scope.currentYear,
            val: $scope.currentYear
        }
        $scope.years.push(item);
        for (var i = 1; i < 10; i++) {
            var ite = {
                title: $scope.currentYear + i,
                val: $scope.currentYear + i
            }
            $scope.years.push(ite)
        }
        var firstger = moment(firstDayOfMonth, 'jYYYY/jM/jD').format('YYYY/M/D');
        var weekDayNo = moment(firstger).isoWeekday()
        $scope.monthDays = moment.jDaysInMonth($scope.today.split("/")[0], Number($scope.today.split("/")[1]) - 1)
        if (weekDayNo < 6) {
            var days = [];
            for (var i = 0; i < weekDayNo + 1; i++) {
                var dayToPush = {
                    date: "-",
                    year: $scope.currentYear,
                    month: null
                }
                days.push(dayToPush);
            }
            for (var i = 0; i < 7 - (weekDayNo + 1); i++) {
                var dayToPush = {
                    date: i + 1,
                    year: $scope.currentYear,
                    month: $scope.currentMonth
                }
                days.push(dayToPush);
            }
            last = 7 - (weekDayNo + 2);
            $scope.month.push(days);

        } else {
            if (weekDayNo == 6) {
                var days = [];
                for (var i = 0; i < 7; i++) {
                    var dayToPush = {
                        date: i + 1,
                        year: $scope.currentYear,
                        month: $scope.currentMonth
                    }
                    days.push(dayToPush)
                }
                last = 7;
                $scope.month.push(days);
            } else {
                var days = [
                    {
                        date: "-",
                        year: $scope.currentYear,
                        month: null
                    }
                ]
                for (var i = 0; i < 6; i++) {
                    var dayToPush = {
                        date: i + 1,
                        year: $scope.currentYear,
                        month: $scope.currentMonth
                    }
                    days.push(dayToPush)
                }
                // var days = ["-", 1, 2, 3, 4, 5, 6];
                last = 7;
                $scope.month.push(days);
            }
        }
        $scope.createMonth(last, Math.ceil(($scope.monthDays + last) / 7))
    }
    $scope.getNextMonth = function () {
        if ($scope.yearlyView) {
            $scope.currentYear++;
            $scope.getYearHoliday($scope.currentYear)
            $scope.setGeneral($scope.currentYear, $scope.currentMonth);
            $scope.creatYearCal()
        } else {
            if ($scope.currentMonth == 12) {
                $scope.getFavmonth(Number($scope.currentYear) + 1, 1)
            } else {
                $scope.getFavmonth($scope.currentYear, Number($scope.currentMonth) + 1)
            }
        }
    }
    $scope.getPreMonth = function () {
        if ($scope.yearlyView) {
            $scope.currentYear--;
            $scope.setGeneral($scope.currentYear, $scope.currentMonth);
            $scope.getYearHoliday($scope.currentYear)
            $scope.creatYearCal()
        } else {
            if ($scope.currentMonth == 1) {
                $scope.getFavmonth(Number($scope.currentYear) - 1, 12)
            } else {
                $scope.getFavmonth($scope.currentYear, Number($scope.currentMonth) - 1)
            }
        }
    }
    $scope.getFavmonth = function (year, month) {
        $scope.month = []
        var firstDayOfMonth = year + "/" + month + "/1";
        $scope.currentMonth = Number(month);

        $scope.currentYear = Number(year);
        $scope.setGeneral($scope.currentYear, $scope.currentMonth - 1);
        for (var i = 9; i > 0; i--) {
            var ite = {
                title: $scope.currentYear - i,
                val: $scope.currentYear - i
            }
            $scope.years.push(ite)
        }
        var item = {
            title: $scope.currentYear,
            val: $scope.currentYear
        }
        $scope.years.push(item);
        for (var i = 1; i < 10; i++) {
            var ite = {
                title: $scope.currentYear + i,
                val: $scope.currentYear + i
            }
            $scope.years.push(ite)
        }
        var firstger = moment(firstDayOfMonth, 'jYYYY/jM/jD').format('YYYY/M/D');
        var weekDayNo = moment(firstger).isoWeekday()
        $scope.monthDays = moment.jDaysInMonth(Number($scope.currentYear), Number($scope.currentMonth) - 1)
        if (weekDayNo < 6) {
            var days = [];
            for (var i = 0; i < weekDayNo + 1; i++) {
                var dayToPush = {
                    date: "-",
                    year: $scope.currentYear,
                    month: null
                }
                days.push(dayToPush);
            }
            for (var i = 0; i < 7 - (weekDayNo + 1); i++) {
                var dayToPush = {
                    date: i + 1,
                    year: $scope.currentYear,
                    month: $scope.currentMonth
                }
                days.push(dayToPush);
            }
            last = 7 - (weekDayNo + 2);
            $scope.month.push(days);

        } else {
            if (weekDayNo == 6) {
                var days = [];
                for (var i = 0; i < 7; i++) {
                    var dayToPush = {
                        date: i + 1,
                        year: $scope.currentYear,
                        month: $scope.currentMonth
                    }
                    days.push(dayToPush)
                }
                last = 7;
                $scope.month.push(days);
            } else {
                var days = [
                    {
                        date: "-",
                        year: $scope.currentYear,
                        month: null
                    }
                ]
                for (var i = 0; i < 6; i++) {
                    var dayToPush = {
                        date: i + 1,
                        year: $scope.currentYear,
                        month: $scope.currentMonth
                    }
                    days.push(dayToPush)
                }
                last = 7;
                $scope.month.push(days);
            }
        }
        if (last == 0 && $scope.monthDays >= 30) {
            $scope.createMonth(last, 6)
        } else if (last == 1 && $scope.monthDays == 31) {
            $scope.createMonth(last, 6)
        }
        else {
            $scope.createMonth(last, Math.ceil(($scope.monthDays + last) / 7))
        }
        $scope.getMonthHoliday($scope.currentMonth, $scope.currentYear)
    }
    $scope.createMonth = function (lastDay, weeks) {
        if (lastDay == 7) {
            var newweek = weeks - 2
        } else {
            var newweek = weeks - 1
        }
        for (var i = 0; i < newweek; i++) {
            var days = [];
            for (var j = 1; j < 8; j++) {
                if (($scope.month[$scope.month.length - 1][6].date + j) <= $scope.monthDays) {
                    var dayToPush1 = {
                        date: $scope.month[$scope.month.length - 1][6].date + j,
                        year: $scope.currentYear,
                        month: $scope.currentMonth
                    }
                    days.push(dayToPush1)
                } else {
                    var dayToPush = {
                        date: "-",
                        year: $scope.currentYear,
                        month: null
                    }
                    days.push(dayToPush);
                }
            }
            $scope.month.push(days);
        }
    }
    $scope.createMonthYearly = function (lastDay, weeks, array, monthDays, year, month) {

        var last = array[array.length - 1][6].date

        var items = []
        if (lastDay == 7) {
            var newweek = weeks - 2
        } else {
            var newweek = weeks - 1
        }
        for (var i = 0; i < newweek; i++) {
            var days = [];
            for (var j = 1; j < 8; j++) {
                if ((last + j) <= monthDays) {
                    var dayToPush1 = {
                        date: last + j,
                        year: year,
                        month: month
                    }

                    days.push(dayToPush1)
                } else {
                    var dayToPush = {
                        date: "-",
                        year: year,
                        month: null
                    }
                    days.push(dayToPush);
                }
            }
            last = days[days.length - 1].date;
            // newArray.push(days);
            items.push(days);
        }
        return items

    }
    $scope.changeView = function () {
        if ($scope.yearlyView) {
            $scope.yearlyView = false
            // $scope.getFavmonth($scope.currentYear, Number($scope.currentMonth))
        } else {
            $scope.yearlyView = true;
            $scope.getYearHoliday($scope.currentYear)
        }
        $scope.setChange($scope.yearlyView)
    }
    $scope.changeView1 = function () {
        $scope.yearlyView = false
        $scope.setChange($scope.yearlyView)

        $scope.getFavmonth($scope.currentYear, Number($scope.currentMonth))
    }
    $scope.creatYearCal = function () {

        $scope.yearMonths = [
            {
                title: "فروردین",
                monthsDay: [],
                year: $scope.currentYear,
                monthNo: 1
            },
            {
                title: "اردیبهشت",
                monthsDay: [],
                year: $scope.currentYear,
                monthNo: 2
            }, {
                title: "خرداد",
                monthsDay: [],
                year: $scope.currentYear,
                monthNo: 3
            }, {
                title: "تیر",
                monthsDay: [],
                year: $scope.currentYear,
                monthNo: 4
            }, {
                title: "مرداد",
                monthsDay: [],
                year: $scope.currentYear,
                monthNo: 5
            }, {
                title: "شهریور",
                monthsDay: [],
                year: $scope.currentYear,
                monthNo: 6
            }, {
                title: "مهر",
                monthsDay: [],
                year: $scope.currentYear,
                monthNo: 7
            }, {
                title: "آبان",
                monthsDay: [],
                year: $scope.currentYear,
                monthNo: 8
            }, {
                title: "آذر",
                monthsDay: [],
                year: $scope.currentYear,
                monthNo: 9
            }, {
                title: "دی",
                monthsDay: [],
                year: $scope.currentYear,
                monthNo: 10
            }, {
                title: "بهمن",
                monthsDay: [],
                year: $scope.currentYear,
                monthNo: 11
            }, {
                title: "اسفند",
                monthsDay: [],
                year: $scope.currentYear,
                monthNo: 12
            }
        ]
        for (var i = 0; i < $scope.yearMonths.length; i++) {
            $scope.yearMonths[i].monthsDay = $scope.createYearMonth($scope.yearMonths[i].year, $scope.yearMonths[i].monthNo)

        }
        for (var i = 0; i < $scope.thisMonthHolidays.item1.length; i++) {
            for (var j = 0; j < $scope.thisMonthHolidays.item1[i].myHolidays.length; j++) {
                $scope.checkSettingDate($scope.thisMonthHolidays.item1[i].myHolidays[j], $scope.thisMonthHolidays.item1[i].monthId)
            }
        }
    }
    $scope.checkSettingDate = function (item, index) {
        if(item.holidaysName != undefined && item.holidaysName != null) {
            item.name = item.holidaysName
        }
        for (var i = 0; i < $scope.yearMonths[index - 1].monthsDay.length; i++) {
            for (var j = 0; j < $scope.yearMonths[index - 1].monthsDay[i].length; j++) {
                if ($scope.yearMonths[index - 1].monthsDay[i][j].date != "-") {
                    if(item.specialDayDate != undefined && item.specialDayDate != null) {
                        if ($scope.transformGergorianValue(item.specialDayDate) == $scope.yearMonths[index - 1].monthsDay[i][j].year + "/" + $scope.yearMonths[index - 1].monthsDay[i][j].month + "/" + $scope.yearMonths[index - 1].monthsDay[i][j].date) {
                            $scope.yearMonths[index - 1].monthsDay[i][j].isOff = true;
                            $scope.yearMonths[index - 1].monthsDay[i][j].item = item;
                        }
                    }else  if(item.holiDayDate != undefined && item.holiDayDate != null) {
                        if ($scope.transformGergorianValue(item.holiDayDate) == $scope.yearMonths[index - 1].monthsDay[i][j].year + "/" + $scope.yearMonths[index - 1].monthsDay[i][j].month + "/" + $scope.yearMonths[index - 1].monthsDay[i][j].date) {
                            $scope.yearMonths[index - 1].monthsDay[i][j].isOff = true;
                            $scope.yearMonths[index - 1].monthsDay[i][j].item = item;
                        }
                    }
                    else  {
                        if ($scope.transformGergorianValue(item.holidayDate) == $scope.yearMonths[index - 1].monthsDay[i][j].year + "/" + $scope.yearMonths[index - 1].monthsDay[i][j].month + "/" + $scope.yearMonths[index - 1].monthsDay[i][j].date) {
                            $scope.yearMonths[index - 1].monthsDay[i][j].isOff = true;
                            $scope.yearMonths[index - 1].monthsDay[i][j].item = item;
                        }
                    }
                }
            }
        }
    }
    $scope.checkSettingMonthDate = function (item, index) {
        for (var i = 0; i < $scope.month.length; i++) {
            for (var j = 0; j < $scope.month[i].length; j++) {
                if ($scope.month[i][j].date != "-") {
                    if ($scope.transformGergorianValue(item.holidayDate) == $scope.month[i][j].year + "/" + $scope.month[i][j].month + "/" + $scope.month[i][j].date) {
                        $scope.month[i][j].isOff = true;
                        $scope.month[i][j].item = item;
                    }
                }
            }
        }
    }
    $scope.createYearMonth = function (year, month) {
        var days = [];
        var monthDaysArray = []
        var firstDayOfMonth = year + "/" + month + "/1";
        var firstger = moment(firstDayOfMonth, 'jYYYY/jM/jD').format('YYYY/M/D');
        var weekDayNo = moment(firstger).isoWeekday()
        var monthDays = moment.jDaysInMonth(Number(year), Number(month) - 1);
        if (weekDayNo < 6) {
            // var days = [];
            for (var i = 0; i < weekDayNo + 1; i++) {
                var dayToPush = {
                    date: "-",
                    year: year,
                    month: null
                }
                days.push(dayToPush);
            }
            for (var i = 0; i < 7 - (weekDayNo + 1); i++) {
                var dayToPush = {
                    date: i + 1,
                    year: year,
                    month: month
                }
                days.push(dayToPush);
            }
            last = 7 - (weekDayNo + 2);
            monthDaysArray.push(days);

        } else {
            if (weekDayNo == 6) {
                // var days = [];
                for (var i = 0; i < 7; i++) {
                    var dayToPush = {
                        date: i + 1,
                        year: year,
                        month: month
                    }
                    days.push(dayToPush)
                }
                last = 7;
                monthDaysArray.push(days);
            } else {
                var days = [
                    {
                        date: "-",
                        year: year,
                        month: null
                    }
                ]
                for (var i = 0; i < 6; i++) {
                    var dayToPush = {
                        date: i + 1,
                        year: year,
                        month: month
                    }
                    days.push(dayToPush)
                }
                last = 7;
                monthDaysArray.push(days);
            }
        }
        if (last == 0 && monthDays >= 30) {
            // $scope.createMonthYearly(last, 6)
            var getItem = $scope.createMonthYearly(last, 6, monthDaysArray, monthDays, year, month);
            for (var i = 0; i < getItem.length; i++) {
                monthDaysArray.push(getItem[i])
            }
        } else if (last == 1 && monthDays == 31) {
            // $scope.createMonth(last, 6)
            var getItem = $scope.createMonthYearly(last, 6, monthDaysArray, monthDays, year, month);
            for (var i = 0; i < getItem.length; i++) {
                monthDaysArray.push(getItem[i])
            }
        }
        else {
            var getItem = $scope.createMonthYearly(last, Math.ceil((monthDays + last) / 7), monthDaysArray, monthDays, year, month);
            for (var i = 0; i < getItem.length; i++) {
                monthDaysArray.push(getItem[i])
            }
        }
        return monthDaysArray
    }
    $scope.getYearByMonth = function (data) {
        $scope.currentMonth = data.monthNo;
        $scope.changeView();
        $scope.getFavmonth($scope.currentYear, $scope.currentMonth)

    }
    $scope.sendDate = function (data, type) {
        $scope.editingDate = data;
        if (!$scope.importStatus) {
            $scope.dayClick(data, type);
        } else {
            if($scope.addingHolidayToShift) {
                if(type == 3 || type == 1) {
                    $scope.addToPreLoad(data)
                }else if(type == 2) {
                    $scope.setlawOpenDay(data);
                }else {
                    $scope.setLawOffDay(data);
                }
            }
        }
    }
    $scope.$on("delete", function (evt) {
        $scope.editingDate.holidayName = null
        $scope.editingDate.holidayId = null
    });
    $scope.transformGergorian = function (data) {
        return moment(data.year + "/" + data.month + "/" + data.date, 'jYYYY/jM/jD').format('YYYY / MM / DD')
    }
    $scope.transformGergorianValue = function (data) {
        var dateToSend = new Date(data);
        return moment(dateToSend.getFullYear() + "/" + Number(dateToSend.getMonth() + 1) + "/" + dateToSend.getDate(), 'YYYY/M/D').format('jYYYY/jM/jD')
    }
    $scope.$on("importHoliday", function (evt) {
        $scope.importStatus = true;
        $scope.totalHolidayImport = [];
        for (var i = 0; i < $scope.yearMonths.length; i++) {
            for (var j = 0; j < $scope.yearMonths[i].monthsDay.length; j++) {
                for (x = 0; x < $scope.yearMonths[i].monthsDay[j].length; x++) {
                    $scope.yearMonths[i].monthsDay[j][x].isOff = false;
                    $scope.yearMonths[i].monthsDay[j][x].item = null;
                }
            }
        }
        for (var i = 0; i < $scope.thisMonthHolidays.item1.length; i++) {
            for (var j = 0; j < $scope.thisMonthHolidays.item1[i].myHolidays.length; j++) {
                $scope.totalHolidayImport.push($scope.thisMonthHolidays.item1[i].myHolidays[j]);
                $scope.checkSettingDate($scope.thisMonthHolidays.item1[i].myHolidays[j], $scope.thisMonthHolidays.item1[i].monthId)
            }
        }
    })
    $scope.$on("cancelImport", function (evt) {
        $scope.importStatus = false;
    })
    $scope.addToPreLoad = function (day) {
        if (day.isOff) {
            day.isOff = false;
            day.law = undefined;
            for (var i = 0; i < $scope.totalHolidayImport.length; i++) {
                if (day.item.holidayDate.split("T")[0] == $scope.totalHolidayImport[i].holidayDate.split("T")[0]) {
                    $scope.totalHolidayImport.splice(i, 1);
                    day.item = null;
                    break;
                }
            }
            day.item = null;
        } else {
            if(day.law != undefined) {
                $scope.resetOpenDayLaw(day);
            }
            $scope.addingDate = day;
            $scope.setImportDate(day);
        }
    }
    $scope.$on("createConfirm", function (evt) {
        $scope.addingDate.isOff = true;
        $scope.addingDate.item = $scope.createHoliday;
        $scope.totalHolidayImport.push($scope.createHoliday);
    })
    $scope.confirmImport = function () {
        for(var i = 0;i < $scope.totalHolidayImport.length;i++) {
            $scope.totalHolidayImport[i].monthId = Number($scope.transformGergorianValue($scope.totalHolidayImport[i].holidayDate).split("/")[1]);
        }
        $scope.senImport($scope.totalHolidayImport, $scope.currentYear)
    }
    $scope.$on("setHolidyForMonth", function (evt) {
        for (var i = 0; i < $scope.thisMonthHolidays.item1.length; i++) {
            $scope.checkSettingMonthDate($scope.thisMonthHolidays.item1[i], $scope.thisMonthHolidays.item1[i].monthId)
        }
    })
    $scope.$on("addLawToHoliday",function(evt) {
        for(var i = 0; i < $scope.totalHolidayImport.length;i++){
            if($scope.addingLawData.item.holidayDate == $scope.totalHolidayImport[i].holidayDate) {
                $scope.totalHolidayImport[i].law = $scope.addingLawData.law
            }
        }
    })
}])