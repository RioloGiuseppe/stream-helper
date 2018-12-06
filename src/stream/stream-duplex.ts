import { StreamBuilder } from "./stream-builder";
import { StreamParser } from "./stream-parser";
import { PayloadManager } from "../payload/payload-manager";
import { CrcFunction, LogFunction } from "../payload/serializable-interface";


export class StreamDuplex extends StreamParser {

    private _startByte: number;
    private _builder: StreamBuilder;
    private _checksum: CrcFunction;
     public trace: boolean = false;
    
    public get startByte(): number { return this._startByte; }
    public set startByte(value: number) {
        this._startByte = value;
        if (this._builder)
            this._builder.startByte = value;
    }

    public get checksum(): CrcFunction { return this._checksum; }
    public set checksum(value: CrcFunction) {
        this._checksum = value;
        if (this._builder)
            this._builder.checksum = value;
    }

    public get logFunction(): LogFunction { return super.logFunction; }
    public set logFunction(value: LogFunction) {
        super.logFunction = value;
        if (this._builder)
            this._builder.logFunction = value;
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