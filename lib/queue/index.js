"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = (function () {
    function Queue(size) {
        this._size = Math.max(+size | 0, 1);
        this.slots = [];
        for (var i = 0; i < this._size; i++) {
            this.slots.push([]);
        }
    }
    Queue.prototype.size = function () {
        if (this.total == null) {
            this.total = 0;
            for (var i = 0; i < this._size; i++) {
                this.total += this.slots[i].length;
            }
        }
        return this.total;
    };
    Queue.prototype.enqueue = function (obj, priority) {
        var priorityOrig;
        priority = priority && +priority | 0 || 0;
        this.total = null;
        if (priority) {
            priorityOrig = priority;
            if (priority < 0 || priority >= this._size) {
                priority = (this._size - 1);
            }
        }
        this.slots[priority].push(obj);
    };
    Queue.prototype.dequeue = function () {
        var obj = null, sl = this.slots.length;
        this.total = null;
        for (var i = 0; i < sl; i++) {
            if (this.slots[i].length > 0) {
                obj = this.slots[i].shift();
                break;
            }
        }
        return obj;
    };
    return Queue;
}());
exports.default = Queue;
