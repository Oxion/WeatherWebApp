var request = require('request');
var querystring = require('querystring');

function RequestQueue() {
    this.queue = [];
    this.handleQueue();
}

RequestQueue.prototype.runUsingQueue = function (url, callback) {
    this.queue.push({
        url: url, 
        callback: callback
    });
}

RequestQueue.prototype.handleQueue = function () {
    while (true) {
        setTimeout(function() {
            var req = this.queue.shift();
            request(req.url, req.callback);
        }, 10000);
    }
}

module.exports = RequestQueue;