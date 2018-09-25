import { StreamBuilder } from "./stream-builder";
import { StreamParser } from "./stream-parser";


export abstract class StreamManager extends StreamParser {
    private _builder: StreamBuilder;

    protected abstract messageStart: number;
    protected checkSum?: (data: Buffer) => Buffer = null;

    protected abstract stuffing: (data: Buffer) => Buffer;
    protected abstract unstuffing: (data: Buffer) => Buffer;

    public get builder(): StreamBuilder { return this._builder }

    constructor() {
        super();
        this._builder = new StreamBuilder();
    }

    public send(data: any) {
        this._builder.write(data);
    }

}