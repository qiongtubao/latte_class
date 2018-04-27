import latte_lib from 'latte_lib'
let Fs = latte_lib.fs;
/**
    @module latte_class
    @namespace FileObject
 */

/**
    @desc FileObject的配置对象
    @class Config 
    @interface
    @property  filePath
    @property  defaultData
 */
export interface Config {
    /**
     @description 字符串转对象方法
     @property {Function} parse
     */
    parse?: Function;
    /**
     @description 对象转字符串方法
     @property {Function} stringify
     */
    stringify?: Function;
    /**
     @description 文件路径
     @property {string} filePath
     */
    filePath: string;
    /**
     @description 默认数据
     @property {any} defaultData
     */
    defaultData?: any;
}
/**
    @class FileObject
 */
export default class FileObject {
    /**
        @description 文件路径
        @property {string} filePath
        @private
     */
    private filePath: string;
    /**
        @description 字符串转对象方法
        @property {Function} parse
        @private
     */
    private parse: Function;
    /**
        @description 对象转字符串方法
        @property {Function} stringify
        @private
    */
    private stringify: Function;
    /**
        @description 数据对象
        @property {any} data
        @private
     */
    private data: any;
    /**
       @description 数据对象
       @property {any} defaultData
       @private
    */
    private defaultData: any;
    /**
     * @constructor
     * @param config 
     */
    constructor(config: Config) {
        this.parse = config.parse || JSON.parse.bind(JSON);
        this.stringify = config.stringify || JSON.stringify.bind(JSON);
        this.filePath = config.filePath;
        this.defaultData = config.defaultData || {};
        this._load();
    }
    /**
     * @desc 加载数据
     * @example
     *      //不建议使用
     *      let fo = require('latte_class').fileObject.create({
     *          filePath: "./{{file-path}}"
     *      });
     *      fo._load("./{{ccc}}")
     *      console.log(fo.filePath);
     * 
     */
    private _load(filePath?: string) {
        this.filePath = filePath || this.filePath;
        var result = Fs.existsSync(filePath || this.filePath);
        if (!result) {
            this.data = latte_lib.object.create(this.defaultData);
            return;
        }
        var data = Fs.readFileSync(filePath || this.filePath);
        try {
            this.data = latte_lib.object.create(this.parse(data));
        } catch (err) {
            console.error("parse fail");
            this.data = latte_lib.object.create(this.defaultData);
        }
    }
    /**
     * @desc 数据同步到文件内
     * @example
     *      //不建议使用
     *      let fo = require('latte_class').fileObject.create({
     *          filePath: "./{{file-path}}"
     *      });
     *      fo.data.set('a', 'b');
     *      fo.data.set('c', 'b');
     *      fo._save();
     */
    _save() {
        Fs.writeFileSync(this.filePath, this.stringify(this.data.toJSON()));
    }
    /**
     * @desc 设置数据
     * @method set
     * @param {string} key 
     * @param {any} value 
     * @example
     *      let fo = require('latte_class').fileObject.create({
     *          filePath: "./{{file-path}}"
     *      });
     *      fo.set('a','b')
     */
    set(key: string, value: any) {
        this.data.set(key, value);
        this._save();
    }
    /**
     * @desc 通过key获取数据
     * @method get
     * @param key 
     * @return {any}
     *      let fo = require('latte_class').fileObject.create({
     *          filePath: "./{{file-path}}"
     *      });
     *      fo.get('a');
     */
    get(key): any {
        return this.data.get(key);
    }
    /**
     * @desc 关闭
     * @method close
     * @example
     *      let fo = require('latte_class').fileObject.create({
     *          filePath: "./{{file-path}}"
     *      });
     *      fo.close();
     */
    close(): any {

    }
    /**
     *  
     * @method create
     * @param {FileObject.Config} config
     * @returns {FileObject.fileObject} 
     * @static
     * @example
     *      let fo = require('latte_class').fileObject.create({
     *          filePath: "./{{file-path}}"
     *      });
     */
    static create(config: Config) {
        return new FileObject(config);
    }
}