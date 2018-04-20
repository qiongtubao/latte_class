let latte_lib = require('latte_lib')
let Fs = latte_lib.fs;

interface Config {
    parse?: Function;
    stringify?: Function;
    filePath: string;
}

export default class FileObject {
    filePath: string;
    parse: Function;
    stringify: Function;
    data: any;
    constructor(config: Config) {
        this.parse = config.parse || JSON.parse.bind(JSON);
        this.stringify = config.stringify || JSON.stringify.bind(JSON);
        this.filePath = config.filePath;
    }
    /**
     * @desc 加载数据
     */
    load() {
        var result = Fs.existsSync(this.filePath);
        if (!result) {
            this.data = latte_lib.object.create({});
            return;
        }
        var data = Fs.readFileSync(this.filePath);
        try {
            this.data = latte_lib.object.create(data);
        } catch (err) {
            console.error("parse fail");
            this.data = latte_lib.object.create({});
        }
    }
    /**
     * @desc 数据同步到文件内
     */
    save() {
        Fs.writeFileSync(this.filePath, this.stringify(this.data.toJSON()));
    }
    /**
     * @desc 设置数据
     * @param {string} key 
     * @param {any} value 
     */
    set(key:string, value:any) {
        this.data.set(key, value);
        this.save();
    }
    /**
     * @desc 通过key获取数据
     * @param key 
     * @return {any}
     */
    get(key):any {
        return this.data.get(key);
    }
}