"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var RemoveIdle = (function () {
    function RemoveIdle(config) {
        this.reapIntervalMillis = config.reapIntervalMillis || 1000;
        this.idleTimeoutMillis = config.idleTimeoutMillis || 10000;
        this.refreshIdle = config.refreshIdle || true;
        this.returnToHead = config.returnToHead || false;
        this.scheduleRemoveIdle();
        this.min = config.min || 0;
        this.max = config.max || 1000;
        this.availableObjects = [];
        this._destroy = config.destroy || function () { };
        this._create = config.create;
        this.log = config.log || function () { };
        this.removeConditions = config.removeConditions || function () { return true; };
        this.ensureMinimum = config.ensureMinimum || function () { };
        this.dispense = config.dispense || function () { };
    }
    ;
    RemoveIdle.prototype.scheduleRemoveIdle = function () {
        if (!this.removeIdleScheduled) {
            this.removeIdleScheduled = true;
            this.removeIdleTimer = setTimeout(this.removeIdle.bind(this), this.reapIntervalMillis);
        }
    };
    RemoveIdle.prototype.removeIdle = function () {
        var toRemove = [], now = new Date().getTime(), self = this;
        this.removeIdleScheduled = false;
        for (var i_1 = 0, len_1 = this.availableObjects.length; (i_1 < len_1 && this.removeConditions()); i_1++) {
            var timeout = this.availableObjects[i_1].timeout;
            if (now > timeout) {
                toRemove.push(this.availableObjects[i_1].obj);
            }
        }
        for (var i = 0, len = toRemove.length; i < len; i++) {
            self.destroy(toRemove[i]);
        }
        if (this.availableObjects.length > 0) {
            this.scheduleRemoveIdle();
        }
    };
    RemoveIdle.prototype.destroy = function (obj) {
        this.getIdle(obj);
        this._destroy(obj);
        this.ensureMinimum();
    };
    RemoveIdle.prototype.getIdle = function (obj) {
        this.availableObjects = this.availableObjects.filter(function (objWithTimeout) {
            return (objWithTimeout.obj !== obj);
        });
    };
    RemoveIdle.prototype.size = function () {
        return this.availableObjects.length;
    };
    RemoveIdle.prototype.update = function (obj) {
        for (var i = 0, len = this.availableObjects.length; (i < len && this.removeConditions()); i++) {
            if (obj == this.availableObjects[i].obj) {
                this.availableObjects[i].timeout = new Date().getTime() + this.idleTimeoutMillis;
            }
        }
    };
    RemoveIdle.prototype.release = function (obj) {
        if (this.availableObjects.some(function (objWithTimeout) {
            if (objWithTimeout.obj === obj) {
                objWithTimeout.timeout = new Date().getTime() + this.idleTimeoutMillis;
                return true;
            }
        })) {
            this.log && this.log.error("called twice for the same resource");
            return;
        }
        ;
        var objWithTimeout = { obj: obj, timeout: (new Date().getTime() + this.idleTimeoutMillis) };
        if (this.returnToHead) {
            this.availableObjects.splice(0, 0, objWithTimeout);
        }
        else {
            this.availableObjects.push(objWithTimeout);
        }
        this.dispense();
        this.scheduleRemoveIdle();
    };
    RemoveIdle.prototype.destroyAllNow = function (callback) {
        var willDie = this.availableObjects;
        this.availableObjects = [];
        var obj = willDie.shift();
        var self = this;
        while (obj !== null && obj !== undefined) {
            self.destroy(obj.obj);
            obj = willDie.shift();
        }
        this.removeIdleScheduled = false;
        clearTimeout(this.removeIdleTimer);
        callback && callback();
    };
    return RemoveIdle;
}());
exports.default = RemoveIdle;
