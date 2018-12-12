/// <reference types="node" />
import { TransformCallback, Transform } from "stream";
import { PayloadManager } from "../payload/payload-manager";
import { CrcFunction, LogFunction } from "../payload/serializable-interface";
export declare class StreamParser extends Transform {
    startByte: number;
    crcFunction: CrcFunction;
    logFunction: LogFunction;
    trace: boolean;
    constructor(payloadManager?: PayloadManager);
    permissive: boolean;
    private _payloadManager;
    private _len;
    private _head;
    private _payload;
    private _started;
    private _crcRead;
    private _crc;
    _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void;
    private _parse;
    private _reset;
    _flush(cb: () => void): void;
}
