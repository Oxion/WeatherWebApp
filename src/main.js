var OpenWeatherMapApi = require('./api/OpenWeatherMapApi.js');
var express = require("express");
var path = require('path');

var openWeatherMapApi = new OpenWeatherMapApi({
    apiKey: "ad1f438eb09027e3a9f0b8e6727f0164"
});

var expressApp = express();
expressApp.use("/res", express.static(path.join(__dirname, "static")));

expressApp.get("/api/weather", (req, res) => {
    var promise = openWeatherMapApi.getByCityName("Kirov");
    promise.then((result) => {
        res.json(result);
    }, (reason) => {
        res.json(reason);
        console.error("Error occurs on weather request:", reason);
    });
});

expressApp.listen(3000);







