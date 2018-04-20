"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_lib = require('latte_lib');
var Fs = latte_lib.fs;
var FileObject = (function () {
    function FileObject(config) {
        this.parse = config.parse || JSON.parse.bind(JSON);
        this.stringify = config.stringify || JSON.stringify.bind(JSON);
        this.filePath = config.filePath;
    }
    FileObject.prototype.load = function () {
        var result = Fs.existsSync(this.filePath);
        if (!result) {
            this.data = latte_lib.object.create({});
            return;
        }
        var data = Fs.readFileSync(this.filePath);
        try {
            this.data = latte_lib.object.create(data);
        }
        catch (err) {
            console.error("parse fail");
            this.data = latte_lib.object.create({});
        }
    };
    FileObject.prototype.save = function () {
        Fs.writeFileSync(this.filePath, this.stringify(this.data.toJSON()));
    };
    FileObject.prototype.set = function (key, value) {
        this.data.set(key, value);
        this.save();
    };
    FileObject.prototype.get = function (key) {
        return this.data.get(key);
    };
    return FileObject;
}());
exports.default = FileObject;
