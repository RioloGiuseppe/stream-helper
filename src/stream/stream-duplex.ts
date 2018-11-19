import { StreamBuilder } from "./stream-builder";
import { StreamParser } from "./stream-parser";
import { PayloadManager } from "../payload/payload-manager";
import { CrcFunction } from "../payload/serializable-interface";


export class StreamDuplex extends StreamParser {

    private _startByte: number;
    private _checksum: CrcFunction;
    private _builder: StreamBuilder;
    public get startByte(): number { return this._startByte; }
    public set startByte(value: number) {
        this._startByte = value;
        this._builder.startByte = value;
    }
    public get checksum(): CrcFunction { return this._checksum; }
    public set checksum(value: CrcFunction) {
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