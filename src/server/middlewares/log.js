var loggers = require('../loggers');

var Log = {
    access: function () {
        return (req, res, next) => {
            loggers.access.verbose('Access', {
                ip: req.ip,
                method: req.method,
                url: req.url,
                isAuthorized: res.locals.isAuthorized,
                user: res.locals.user
            });

            next();
        }
    },

    serverError: function () {
        return (err, req, res, next) => {
            loggers.app.error('Internal server error', err),
            next(err);
        }
    }
}

module.exports = Log;