/**
    @module latte_class
    @namespace Queue
    @class Queue
*/
export default class Queue {
    private _size: number;
    slots: any[][];
    total: number;
    /**
     * @constructor
     * @param {number} size 
     */
    constructor(size?) {
        this._size = Math.max(+size | 0, 1);
        this.slots = [];
        for (var i = 0; i < this._size; i++) {
            this.slots.push([]);
        }
    }
    /**
     *  @desc 获得队列里对象个数
     *  @method size
     *  @return {Int} total
     *  @sync
     *  @example
     *      var Queue =  require("latte_class").Queue;
     *      console.log(Queue);
     *      var queue = new Queue();
     *      log(queue.size()); //0 
     */
    size() {
        if (this.total == null) {
            this.total = 0;
            for (var i = 0; i < this._size; i++) {
                this.total += this.slots[i].length;
            }
        }
        return this.total;
    }
    /**
        @desc 队列存入对象
        @method enqueue
        @param {number} priority
        @param {any} obj
        @example
            var Queue = require("latte_class").Queue;
            var q = new Queue(2);
            q.enqueue("1", 0);
            q.enqueue("2", 1);
            q.enqueue("3",0);
            log(q.size());//3
            log(q.dequeue());//1
            log(q.dequeue());//3
            log(q.dequeue());//2
    */
    enqueue(obj: any, priority?: number) {
        let priorityOrig;
        priority = priority && +priority | 0 || 0;
        this.total = null;
        if (priority) {
            priorityOrig = priority;
            if (priority < 0 || priority >= this._size) {
                priority = (this._size - 1);
            }
        }
        this.slots[priority].push(obj);
    }
    /**
        @desc 从队列里取出对象
        @method dequeue
        @return {any} obj
        @example
            var Queue = require("latte_class").queue;
            var q = new Queue();
            var one = q.dequeue();
            log(one); //null
            q.enqueue("1");
            var two = q.dequeue();
            log(two); // 1

    */
    dequeue() {
        let obj = null, sl = this.slots.length;
        this.total = null;
        for (var i = 0; i < sl; i++) {
            if (this.slots[i].length > 0) {
                obj = this.slots[i].shift();
                break;
            }
        }
        return obj;
    }
}