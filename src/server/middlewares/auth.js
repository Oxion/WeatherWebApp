var loggers = require('../loggers');

function getAuthToken(req) {
    var authHeader = req.get('Authorization');
    if (!authHeader) { return }

    var authHeaderParts = authHeader.split(" ");
    if (!authHeaderParts || authHeaderParts.length != 2) { return }

    if (!authHeaderParts[0] || authHeaderParts[0].toLowerCase() != "bearer") { return }

    return authHeaderParts[1];
}

var Auth = {
    retrieve: function () {
        return (req, res, next) => {
            var authToken = getAuthToken(req);
            if (!authToken) {
                
                loggers.access.info("Request authorization failed - authToken is undefined", { ip: req.ip });
                next();

                return;
            }

            res.locals.isAuthorized = true;
            res.locals.user = {
                username: authToken
            }

            loggers.access.info("Request authorization success", { ip: req.ip, username: res.locals.user.username });

            next();
        }
    },

    guard: function () {
        return (req, res, next) => {
            if (!res.locals || !res.locals.user || !res.locals.isAuthorized) {
                var status = 401;
                var error = {
                    type: "authorization",
                    detail: "Unauthorized",
                    description: "Authorization required"
                };
                
                loggers.access.error('Attempt to get access to protected route without authorization', { ip: req.ip, status, error });
                res.status(status).json(error);

                next();
                return;
            }

            next();
        }
    }
}

module.exports = Auth;

