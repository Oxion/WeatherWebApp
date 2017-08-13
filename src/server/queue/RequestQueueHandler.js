var querystring = require('querystring');

var secrets = require('../secrets');

var ParameterCheck = require('../util/ParameterCheck');
var OpenWeatherMapApi = require('../api/OpenWeatherMapApi');

var openWeatherMapApi = new OpenWeatherMapApi({ apiKey: secrets.openWeatherMapApi.apiKey });

function RequestQueueHandler() {}

RequestQueueHandler.prototype.getGroupingKey = function (data) {
    return querystring.stringify(data);
}

RequestQueueHandler.prototype.doRequest = function (data, resolve, reject) {

    openWeatherMapApi
        .getByCityName(data.cityName)
        .then((result) => { //Emulated long response time

            return new Promise((resolve, reject) => {
                setTimeout(() => { resolve(result) }, 3000);
            });

        })
        .then((result) => {
            if (!result) {
                var error = {
                    type: "invalidResponse",
                    detail: "emptyResponse",
                    description: "Response is empty"
                };

                reject(error);
                return;
            }

            
            try {
                var data = JSON.parse(result);
                resolve(data);
            } catch (e) {
                var error = {
                    type: "invalidResponse",
                    detail: "invalidJSON",
                    description: "Response contains invalid JSON string"
                };

                reject(error);
            }
        }, (reason) => {
            reject(reason);
        });
}

module.exports = RequestQueueHandler;