import { StreamBuilder } from "./stream-builder";
import { StreamParser } from "./stream-parser";
import { PayloadManager } from "../payload/payload-manager";
import { CrcFunction, LogFunction } from "../payload/serializable-interface";
export declare class StreamDuplex extends StreamParser {
    private _builder;
    constructor(payloadManager?: PayloadManager);
    startByte: number;
    crcFunction: CrcFunction;
    trace: boolean;
    logFunction: LogFunction;
    readonly builder: StreamBuilder;
    send(data: any): void;
}
