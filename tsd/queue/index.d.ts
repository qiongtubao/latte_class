export default class Queue {
    private _size;
    slots: any[][];
    total: number;
    constructor(size?: any);
    size(): number;
    enqueue(obj: any, priority?: number): void;
    dequeue(): any;
}
