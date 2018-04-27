"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_lib_1 = require("latte_lib");
var Fs = latte_lib_1.default.fs;
var FileObject = (function () {
    function FileObject(config) {
        this.parse = config.parse || JSON.parse.bind(JSON);
        this.stringify = config.stringify || JSON.stringify.bind(JSON);
        this.filePath = config.filePath;
        this.defaultData = config.defaultData || {};
        this._load();
    }
    FileObject.prototype._load = function (filePath) {
        this.filePath = filePath || this.filePath;
        var result = Fs.existsSync(filePath || this.filePath);
        if (!result) {
            this.data = latte_lib_1.default.object.create(this.defaultData);
            return;
        }
        var data = Fs.readFileSync(filePath || this.filePath);
        try {
            this.data = latte_lib_1.default.object.create(this.parse(data));
        }
        catch (err) {
            console.error("parse fail");
            this.data = latte_lib_1.default.object.create(this.defaultData);
        }
    };
    FileObject.prototype._save = function () {
        Fs.writeFileSync(this.filePath, this.stringify(this.data.toJSON()));
    };
    FileObject.prototype.set = function (key, value) {
        this.data.set(key, value);
        this._save();
    };
    FileObject.prototype.get = function (key) {
        return this.data.get(key);
    };
    FileObject.prototype.close = function () {
    };
    FileObject.create = function (config) {
        return new FileObject(config);
    };
    return FileObject;
}());
exports.default = FileObject;
