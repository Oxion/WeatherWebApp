var querystring = require('querystring');
var uuidv1 = require('uuid/v1');

var ParameterCheck = require('../util/ParameterCheck');
var loggers = require('../loggers');

RequestQueue.REQUEST_STATUS = {
    WAIT: "wait",
    SUCCESS: "success",
    FAILURE: "failure"
}

function RequestQueue(options) {
    ParameterCheck.mandatory('options', options);
    ParameterCheck.mandatory('options.handler', options.handler);
    ParameterCheck.mandatoryNumber('options.maxSize', options.maxSize, true);

    this.handler_ = options.handler;
    this.maxSize_ = options.maxSize;
    
    this.storeTimeout_ = 2000;
    this.pullTimeout_ = Math.round(this.storeTimeout_ / 4); //For real use, count based on server load

    this.mapping_ = {};

    this.queue_ = [];
    this.grouping_ = {};
    this.activeReqGroup_ = null;

    this.ready_ = new Set();

    this.timers_ = {};

    this.planStoreTimeoutHandle_();
}

RequestQueue.prototype.add = function (data) {
    var groupingKey = this.handler_.getGroupingKey(data);
    var mappingKey = this.getMappingKey_();

    var reqGroup = this.grouping_[groupingKey];
    if (!reqGroup) {
        
        if (this.queue_.length >= this.maxSize_) {
            return;
        }
        
        reqGroup = this.createReqGroup_(groupingKey, data);
        this.grouping_[groupingKey] = reqGroup;
        this.queue_.push(reqGroup);
    }

    this.mapping_[mappingKey] = reqGroup;
    reqGroup.int.mappingKeys.add(mappingKey);

    this.handleQueue_();

    return mappingKey;
}

RequestQueue.prototype.getResponse = function (id) {
    var reqGroup = this.mapping_[id];
    if (!reqGroup) { return }

    if (reqGroup.int.completed) {
        delete this.mapping_[id];
        reqGroup.int.mappingKeys.delete(id);
    }

    return Object.assign({ id, pullTimeout: this.pullTimeout_ }, reqGroup.ext);
}

RequestQueue.prototype.handleQueue_ = function () {
    if (this.activeReqGroup_ || this.queue_.length < 1) {
        return;
    }

    this.activeReqGroup_ = this.queue_.shift();
    this.doRequest_(this.activeReqGroup_);
}

RequestQueue.prototype.doRequest_ = function (reqGroup) {
    var promise = new Promise((resolve, reject) => {
        this.handler_.doRequest(reqGroup.ext.data, resolve, reject);
    });
    
    promise.then((result) => {
        loggers.app.verbose('reqGroup request success', result);

        reqGroup.ext.status = RequestQueue.REQUEST_STATUS.SUCCESS;
        reqGroup.ext.response = result;
    }, (reason) => {
        loggers.app.verbose('reqGroup request fail', reason);

        reqGroup.ext.status = RequestQueue.REQUEST_STATUS.FAILURE;
        reqGroup.ext.response = reason;
    }).then((result) => {

        delete this.grouping_[reqGroup.int.groupingKey];
        this.activeReqGroup_ = null;

        reqGroup.int.completed = true;
        reqGroup.int.timestamp = Date.now();
        this.ready_.add(reqGroup);

        this.handleQueue_();
    }).catch((reason) => {
        loggers.app.error("Error on reqGroup processing: ", reason);
    });
}

RequestQueue.prototype.createReqGroup_ = function (groupingKey, data) {
    return {
        int: {
            completed: false,
            timestamp: Date.now(),
            groupingKey: groupingKey,
            mappingKeys: new Set()
        },
        ext: {
            data: data,
            status: RequestQueue.REQUEST_STATUS.WAIT,
            response: null
        }
    };
}

RequestQueue.prototype.getMappingKey_ = function () {
    return uuidv1();
}

RequestQueue.prototype.planStoreTimeoutHandle_ = function() {
    if (this.timers_.storeTimeout) {
        clearTimeout(this.timers_.storeTimeout);
        this.timers_.storeTimeout = null;
    }

    setTimeout(() => this.storeTimeoutHandler_(), this.storeTimeout_);
}

RequestQueue.prototype.storeTimeoutHandler_ = function() {
    var curTimestamp = Date.now();
    
    for (var reqGroup of this.ready_) {
        if (curTimestamp - reqGroup.int.timestamp < this.storeTimeout_) {
            continue;
        }

        this.ready_.delete(reqGroup);
        for (var key of reqGroup.int.mappingKeys) {
            delete this.mapping_[key];
        }
    }

    this.planStoreTimeoutHandle_();
}

module.exports = RequestQueue;