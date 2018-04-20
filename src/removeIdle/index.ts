interface AvailableObject {
	obj: any;
	timeout: number;
};
/**
    @module RemoveIdle
    @namespace latte_removeIdle
    @class RemoveIdle
*/
export default class RemoveIdle {
	reapIntervalMillis: number;
	idleTimeoutMillis: number;
	refreshIdle: boolean;
	returnToHead: boolean;
	min: number;
	max: number;
	availableObjects: Array<AvailableObject>;
	private _destroy: Function;
	private _create: Function;
	log: any;
	removeIdleScheduled: boolean;
	removeIdleTimer: number;
	removeConditions: Function;
	ensureMinimum: Function;
	dispense: Function;
	constructor(config) {
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
		this.removeConditions = config.removeConditions || function () {return true;}
		this.ensureMinimum = config.ensureMinimum || function () {}
		this.dispense = config.dispense || function() {}
	};
	/**
	 	时间表删除空闲对象
		@method scheduledRemoveIdle
		@example
			var RemoveIdle = require("latte_lib").removeIdle;
			var r = new RemoveIdle({
						idleTimeoutMillis: 1000
			});
			setTimeout(function(){
					r.availableObjects.push({
							timeout: Date.now()-1,
							obj: "1"
					});
					setTimeout(function() {
							log("one", r.size());//one,1
							r.scheduleRemoveIdle();
							log("two",r.size());//two,1
							setTimeout(function(){
										log("three", r.size());//three,0
							},1000);
					}, 2000);
			}, 2000);
	*/
	scheduleRemoveIdle() {
		if (!this.removeIdleScheduled) {
			this.removeIdleScheduled = true;
			this.removeIdleTimer = setTimeout(this.removeIdle.bind(this), this.reapIntervalMillis);
		}
	}
	/**
	    删除空闲
		@method removeIdle
		@example

			var RemoveIdle = require("latte_lib").removeIdle;
			var r = new RemoveIdle({
						idleTimeoutMillis: 1000
			});
			//sleep 2000ms
			//when r.availableObjects.length == 0  then close autoClean;
			setTimeout(function(){
					r.availableObjects.push({
							timeout: Date.now()-1,
							obj: "1"
					});
					setTimeout(function() {
							log("one", r.size());//one,1
							r.removeIdle();
							log("two",r.size());//two,0
					}, 2000);
			}, 2000);

	*/
	removeIdle() {
		let toRemove = [], now = new Date().getTime(),
			self = this;
		this.removeIdleScheduled = false;
		for (let i = 0, len = this.availableObjects.length; (i < len && this.removeConditions()); i++) {
			let timeout = this.availableObjects[i].timeout;
			if (now > timeout) {
				toRemove.push(this.availableObjects[i].obj);
			}
		}
		for (var i = 0, len = toRemove.length; i < len; i++) {
			self.destroy(toRemove[i]);
		}
		if (this.availableObjects.length > 0) {
			this.scheduleRemoveIdle();
		}
	}
	/**
		@method destroy
		@param {any} obj
		@example
			var RemoveIdle = require("latte_lib").removeIdle;
			var r = new RemoveIdle({
						idleTimeoutMillis: 1000
			});
			setTimeout(function(){
					r.availableObjects.push({
							timeout: Date.now()-1,
							obj: "1"
					});
					setTimeout(function() {
							log("one", r.size());//one,1
							r.destroy(r.availableObjects[0].obj);
							log("two",r.size());//two,1
					}, 2000);
			}, 2000);
	*/
	destroy(obj) {
		this.getIdle(obj);
		this._destroy(obj);
		this.ensureMinimum();
	}
	/**
		@method getIdle
		@param {any} obj
		@example
			var RemoveIdle = require("latte_lib").removeIdle;
			var r = new RemoveIdle({
						idleTimeoutMillis: 1000
			});
			var obj = "1";
			r.release(obj);
			log(r.size());//1
			r.getIdle(obj);
			log(r.size());//0
	*/
	getIdle(obj) {
		this.availableObjects = this.availableObjects.filter(function (objWithTimeout) {
			return (objWithTimeout.obj !== obj);
		});
	}
	/**
		@method size
		@return {number}
		@example
			var RemoveIdle = require("latte_lib").removeIdle;
			var r = new RemoveIdle({
						idleTimeoutMillis: 1000
			});
			log(r.size());//0
	*/
	size() {
		return this.availableObjects.length;
	}
	/**
		@method update
		@param {Object} obj
		@example

			var RemoveIdle = require("latte_lib").removeIdle;
			var r = new RemoveIdle({
						idleTimeoutMillis: 1000
			});
			var obj = {
					timeout: Date.now()-1,
					obj: "1"
			};
			setTimeout(function(){

					r.availableObjects.push(obj);
					setTimeout(function() {
							log("one", r.size());//one,1
							r.update(obj.obj);
							r.removeIdle();
							log("two",r.size());//two,1
							setTimeout(function(){
										log("three", r.availableObjects.length);//three,0
							},1000);
					}, 2000);
			}, 2000);

	*/
	update(obj) {
		for (let i = 0, len = this.availableObjects.length; (i < len && this.removeConditions()); i++) {
			if (obj == this.availableObjects[i].obj) {
				this.availableObjects[i].timeout = new Date().getTime() + this.idleTimeoutMillis;
			}
		}
	}
	/**
		add obj in availableObjects
		@method release
		@param {Object} obj
		@public
		@example
			var RemoveIdle = require("latte_lib").removeIdle;
			var r = new RemoveIdle({
				idleTimeoutMillis: 1000
			});
			r.release("1");
			log(r.size());//1
			setTimeout(function(){
				log(r.size());//0
			}, 1000);
	*/
	relese(obj) {
		if (this.availableObjects.some(function (objWithTimeout) {
			if (objWithTimeout.obj === obj) {
				//续时
				objWithTimeout.timeout = new Date().getTime() + this.idleTimeoutMillis;
				return true;
			}
		})) {
			this.log && this.log.error("called twice for the same resource")
			//刷新
			return;
		};
		var objWithTimeout = { obj: obj, timeout: (new Date().getTime() + this.idleTimeoutMillis) }
		if (this.returnToHead) {
			this.availableObjects.splice(0, 0, objWithTimeout);
		} else {
			this.availableObjects.push(objWithTimeout);
		}
		this.dispense();
		this.scheduleRemoveIdle();
	}
	/**
		@method destroyAllNow
		@param {Function} callback
		@example
			var RemoveIdle = require("latte_lib").removeIdle;
			var r = new RemoveIdle({
						idleTimeoutMillis: 1000
			});

			r.availableObjects.push({
					timeout: Date.now()+ 60 * 60 * 1000,
					obj: "1"
			});
			setTimeout(function() {
					log("one", r.size());//one,1
					r.destroyAllNow();
					log("two",r.size());//two,0
			}, 2000);

	*/
	destroyAllNow(callback) {
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
		if (callback) {
			callback();
		}
	}
}

