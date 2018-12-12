import { StreamBuilder } from "./stream-builder";
import { StreamParser } from "./stream-parser";
import { PayloadManager } from "../payload/payload-manager";
import { CrcFunction, LogFunction } from "../payload/serializable-interface";

export class StreamDuplex extends StreamParser {

    private _builder: StreamBuilder;

    constructor(payloadManager?: PayloadManager) {
        super(payloadManager);
        this._builder = new StreamBuilder(payloadManager || null);
    }

    public get startByte(): number {
        return super.startByte;
    }

    public set startByte(value: number) {
        super.startByte = value;
        if (this._builder)
            this._builder.startByte = value;
    }

    public get crcFunction(): CrcFunction {
        return super.crcFunction;
    }

    public set crcFunction(value: CrcFunction) {
        super.crcFunction = value;
        if (this._builder)
            this._builder.crcFunction = value;
    }

    public get trace(): boolean {
        return super.trace;
    }

    public set trace(value: boolean) {
        super.trace = value;
        if (this._builder)
            this._builder.trace = value;
    }

    public get logFunction(): LogFunction {
        return super.logFunction;
    }

    public set logFunction(value: LogFunction) {
        super.logFunction = value;
        if (this._builder)
            this._builder.logFunction = value;
    }

    public get builder(): StreamBuilder {
        return this._builder;
    }

    public send(data: any) {
        this._builder.write(data);
    }

}