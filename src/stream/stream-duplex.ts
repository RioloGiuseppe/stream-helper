import { StreamBuilder } from "./stream-builder";
import { StreamParser } from "./stream-parser";
import { PayloadManager } from "../payload/payload-manager";


export abstract class StreamManager extends StreamParser {

    private _startByte: number;
    private _checksum: (data: Buffer) => Buffer;
    private _builder: StreamBuilder;
    public get startByte(): number { return this._startByte; }
    public set startByte(value: number) {
        this._startByte = value;
        this._builder.startByte = value;
    }
    public get checksum(): (data: Buffer) => Buffer { return this._checksum; }
    public set checksum(value: (data: Buffer) => Buffer) {
        this._checksum = value;
        this._builder.checksum = value;
    }

    public get builder(): StreamBuilder { return this._builder; }

    constructor(payloadManager?: PayloadManager) {
        super(payloadManager);
        this._builder = new StreamBuilder(payloadManager || null);
    }

    public send(data: any) {
        this._builder.write(data);
    }

}