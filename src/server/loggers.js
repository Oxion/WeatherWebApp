var fse = require('fs-extra');

var configs = require('./configs');
var winston = require('winston');

function createLogFile(path) {
    fse.ensureFileSync(path);
    return path;
}

var app = new (winston.Logger)({
    level: configs.loggers.app.level || 'info',
    transports: [
        new (winston.transports.File)({ 
            filename: createLogFile(configs.loggers.app.filename || '../logs/app.log'),
            json: false
        }),
        new (winston.transports.Console)()
    ]
})

var access = new (winston.Logger)({
    level: configs.loggers.access.level || 'info',
    transports: [
        new (winston.transports.File)({ 
            filename: createLogFile(configs.loggers.access.filename || '../logs/access.log'),
            json: false
        })
    ]
})

var actions = new (winston.Logger)({
    level: configs.loggers.actions.level || 'info',
    transports: [
        new (winston.transports.File)({ 
            filename: createLogFile(configs.loggers.actions.filename || '../logs/user.log'),
            json: false
        })
    ]
})

module.exports = {
    app: app,
    access: access,
    actions: actions
}
