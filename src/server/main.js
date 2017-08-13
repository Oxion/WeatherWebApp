var path = require('path');
var process = require('process');

var express = require("express");
var bodyParser = require('body-parser');

var configs = require('./configs.js');
var loggers = require('./loggers.js');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var apiRouter = require('./routes/api');

var AuthMiddleware = require('./middlewares/auth');
var LogMiddleware = require('./middlewares/log');

//Setup express app
var expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));

//Setup static path to serve angular and others static files
expressApp.use("/", express.static(path.join(__dirname, configs.staticPath)));

//Setup routes
expressApp.use(AuthMiddleware.retrieve());
expressApp.use(LogMiddleware.access());

expressApp.use(authRouter);
expressApp.use('/api', AuthMiddleware.guard(), apiRouter);
expressApp.use(LogMiddleware.serverError());

expressApp.use((err, req, res, next) => {
    res.status(500).json({
        type: 'internal',
        detail: 'internalServerError',
        description: 'Internal server error occured'
    });
});

expressApp.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, configs.staticPath, 'index.html'));
})

var port = configs.port || 3000;
expressApp.listen(port, () => {
    loggers.app.info("Server started at port:", port);
});







