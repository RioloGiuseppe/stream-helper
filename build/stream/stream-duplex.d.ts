import { StreamBuilder } from "./stream-builder";
import { StreamParser } from "./stream-parser";
import { PayloadManager } from "../payload/payload-manager";
import { CrcFunction } from "../payload/serializable-interface";
export declare class StreamDuplex extends StreamParser {
    private _startByte;
    private _checksum;
    private _builder;
    startByte: number;
    checksum: CrcFunction;
    readonly builder: StreamBuilder;
    constructor(payloadManager?: PayloadManager);
    send(data: any): void;
}
