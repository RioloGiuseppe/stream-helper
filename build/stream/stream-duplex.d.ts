import { StreamBuilder } from "./stream-builder";
import { StreamParser } from "./stream-parser";
import { PayloadManager } from "../payload/payload-manager";
import { CrcFunction, LogFunction } from "../payload/serializable-interface";
export declare class StreamDuplex extends StreamParser {
    private _startByte;
    private _builder;
    private _checksum;
    trace: boolean;
    startByte: number;
    checksum: CrcFunction;
    logFunction: LogFunction;
    readonly builder: StreamBuilder;
    constructor(payloadManager?: PayloadManager);
    send(data: any): void;
}
