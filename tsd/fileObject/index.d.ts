export interface Config {
    parse?: Function;
    stringify?: Function;
    filePath: string;
    defaultData?: any;
}
export default class FileObject {
    private filePath;
    private parse;
    private stringify;
    private data;
    private defaultData;
    constructor(config: Config);
    private _load(filePath?);
    _save(): void;
    set(key: string, value: any): void;
    get(key: any): any;
    close(): any;
    static create(config: Config): FileObject;
}
