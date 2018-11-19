/// <reference types="node" />
import { TransformCallback, Transform } from "stream";
import { PayloadManager } from "../payload/payload-manager";
import { CrcFunction } from "../payload/serializable-interface";
export declare class StreamParser extends Transform {
    startByte: number;
    crcFunction: CrcFunction;
    constructor(payloadManager?: PayloadManager);
    permissive: boolean;
    private _payloadManager;
    private _len;
    private _head;
    private _payload;
    private _timeout;
    private _started;
    private _crcRead;
    private _crc;
    _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void;
    private _parse;
    private _reset;
    _flush(cb: () => void): void;
}
