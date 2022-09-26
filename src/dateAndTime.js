"use strict";
exports.__esModule = true;
exports.getTimeZone = void 0;
var axios_1 = require("axios");
var date_fns_1 = require("date-fns");
var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
};
var dateAndTime = function (location) {
    var datetimeFormatted;
    (0, axios_1["default"])({
        method: "GET",
        url: "http://worldtimeapi.org/api/timezone/".concat(location)
    })
        .then(function (response) { return response.data; })
        .then(function (data) {
        var timezoneInfo = data;
        var datetime = timezoneInfo.datetime;
        console.log(typeof datetime, typeof (0, date_fns_1.parseISO)(datetime));
        datetimeFormatted = (0, date_fns_1.format)((0, date_fns_1.parseISO)(datetime), 'yyyy-MM-dd');
    });
    return datetimeFormatted;
};
var getTimeZone = function (region) {
    var dateTime;
    (0, axios_1["default"])({
        method: "GET",
        url: "http://worldtimeapi.org/api/timezone"
    })
        .then(function (response) { return response.data; })
        .then(function (data) {
        var listOfTimeZones = data;
        var timezone = listOfTimeZones.filter(function (timezone) {
            return timezone.includes(region);
        })[0];
        dateTime = dateAndTime(timezone);
    });
    return dateTime;
};
exports.getTimeZone = getTimeZone;
