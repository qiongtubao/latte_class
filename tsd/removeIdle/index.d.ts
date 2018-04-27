interface AvailableObject {
    obj: any;
    timeout: number;
}
interface Config {
    reapIntervalMillis?: number;
    idleTimeoutMillis?: number;
    refreshIdle?: boolean;
    returnToHead?: boolean;
    min?: number;
    max?: number;
    destroy?: Function;
    create: Function;
    log?: Function;
    removeConditions?: Function;
    ensureMinimum?: Function;
    dispense?: Function;
}
declare class RemoveIdle {
    reapIntervalMillis: number;
    idleTimeoutMillis: number;
    refreshIdle: boolean;
    returnToHead: boolean;
    min: number;
    max: number;
    availableObjects: AvailableObject[];
    _destroy: Function;
    log: any;
    removeIdleScheduled: boolean;
    removeIdleTimer: number;
    removeConditions: Function;
    ensureMinimum: Function;
    dispense: Function;
    constructor(config: Config);
    scheduleRemoveIdle(): void;
    removeIdle(): void;
    protected getIdle(obj: any): void;
    size(): number;
    update(obj: any): void;
    release(obj: any): void;
    destroyAllNow(callback?: any): void;
    destroy(obj: any): void;
}
declare let create: (config: Config) => RemoveIdle;
export { AvailableObject, RemoveIdle, Config, create };
