var ParameterCheck = require('../util/ParameterCheck.js');
var RequestQueue = require('../util/RequestQueue.js');
var request = require('request');
var querystring = require('querystring');

function OpenWeatherMapApi(options) {
    ParameterCheck.mandatory("options", options);
    ParameterCheck.mandatoryString("options.apiKey", options.apiKey);
    
    this.apiKey_ = options.apiKey;
}

var requestQueue = new RequestQueue();

OpenWeatherMapApi.baseUrl = "http://api.openweathermap.org/data/2.5/weather";

OpenWeatherMapApi.prototype.getByCityName = function (cityName, countryCode) {
    return new Promise((resolve, reject) => {
        var url = this.getRequestUrl_({
            q: `${cityName || ""}${countryCode ? "," + countryCode : ""}`
        });

        requestQueue.runUsingQueue(url, this.getResponseHandler_(resolve , reject));
    });
}

OpenWeatherMapApi.prototype.getByCityId = function (cityId) {
    return new Promise((resolve, reject) => {
        var url = this.getRequestUrl_({
            id: cityId
        });

        requestQueue.runUsingQueue(url, this.getResponseHandler_(resolve , reject));
    });
}

OpenWeatherMapApi.prototype.getByGeoCoords = function (lat, lon) {
    return new Promise((resolve, reject) => {
        var url = this.getRequestUrl_({
            lat: lat,
            lon: lon
        });

        requestQueue.runUsingQueue(url, this.getResponseHandler_(resolve , reject));
    });
}

OpenWeatherMapApi.prototype.getRequestUrl_ = function(obj) {
    obj.appid = this.apiKey_;
    return `${OpenWeatherMapApi.baseUrl}?${querystring.stringify(obj)}`
}

OpenWeatherMapApi.prototype.getResponseHandler_ = function(resolve, reject) {
    return function(error, response, body) {
        if (error) {
            reject(error);
            return;
        }

        resolve(body);
    }
}

module.exports = OpenWeatherMapApi;