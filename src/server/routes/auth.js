var express = require('express');
var router = express.Router();

var loggers = require('../loggers');

router.post("/login", (req, res) => {
    loggers.access.info('Login attempt', { ip: req.ip });

    if (!req.body.username) {
        var status = 400;
        var error = {
            type: "required",
            detail: 'usernameRequired',
            description: "'username' is mandatory query parameter"
        };

        loggers.access.error('Login failed', { ip: req.ip, status, error });
        res.status(status).json(error);

        return;
    }

    if (!req.body.password) {
        var status = 400;
        var error = {
            type: "required",
            detail: 'passwordRequired',
            description: "'password' is mandatory query parameter"
        };

        loggers.access.error('Login failed', { ip: req.ip, status, error });
        res.status(status).json(error);

        return;
    }

    if (req.body.username != req.body.password) {
        var status = 401;
        var error = {
            type: "authorization",
            detail: "BadCredentials",
            description: "Username or password is incorrect"
        };

        loggers.access.error('Login failed', { ip: req.ip, status, error });
        res.status(status).json(error);

        return;
    }

    loggers.access.info("Login success", { ip: req.ip, username: req.body.username });

    //Dummy - for real cases use jwt and user storage
    res.json({
        auth_token: req.body.username
    })
});

router.post("/logout", (req, res) => {
    loggers.access.info('Logout attempt', { ip: req.ip });
});

module.exports = router;