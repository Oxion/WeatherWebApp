var express = require('express');
var router = express.Router();

var configs = require('../configs');
var loggers = require('../loggers');

var RequestQueue = require('../queue/RequestQueue');
var RequestQueueHandler = require('../queue/RequestQueueHandler');

var requestQueueHandler = new RequestQueueHandler();
var requestQueue = new RequestQueue({ 
    handler: requestQueueHandler,
    maxSize: configs.queue.maxSize
});

/**
 * Request weather from request queue
 */
router.get("/weather", (req, res) => {
    var id = req.query.id;
    if (!id) {
        res.status(400).json({
            type: "required",
            detail: 'idRequired',
            description: "'id' is mandatory query parameter"
        });

        return;
    }

    var data = requestQueue.getResponse(id);
    if (!data) {
        res.status(404).json({
            type: "notFound",
            detail: 'responseNotFound',
            description: "No data for specified request id"
        });

        return;
    }

    loggers.actions.info("Weather response", { username: res.locals.user.username, id, data: data });

    res.set({
        'Cache-Control': 'no-cache',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
    }).json(data);
});

/**
 * Request weather throught request queue
 */
router.post("/weather", (req, res) => {

    var query = req.body.q;
    loggers.actions.info("Weather request", { username: res.locals.user.username, query });

    if (!query || !query.trim()) {
        var status = 400;
        var error = {
            type: "required",
            detail: 'qRequired',
            description: "'q' is mandatory query parameter"
        };

        loggers.app.error("Post weather request rejected", {
            username: res.locals.user.username,
            reason: error
        });

        res.status(status).json(error);
        return;
    }

    // "parse"
    var data = {
        cityName: query.trim()
    }

    //add request in queue
    var id = requestQueue.add(data);
    if (!id) {
        var status = 503;
        var error = {
            type: "overload",
            detail: 'queryMaxSizeExceeded',
            description: "Server is overloaded retry later"
        };

        loggers.app.error("Post weather request rejected", {
            username: res.locals.user.username,
            reason: error
        });

        res.status(status).json(error);
        return;
    }

    loggers.app.info("Weather request added", { username: res.locals.user.username, id, data });

    //send response with request id
    res.json({ reqId: id });
});

module.exports = router;