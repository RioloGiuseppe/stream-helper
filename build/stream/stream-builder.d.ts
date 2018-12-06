/// <reference types="node" />
import { TransformCallback, Transform } from "stream";
import { PayloadManager } from "../payload/payload-manager";
import { ISerializable, CrcFunction, IMessage, LogFunction } from "../payload/serializable-interface";
export declare class StreamBuilder extends Transform {
    private _payloadManager;
    startByte: number;
    checksum: CrcFunction;
    logFunction: LogFunction;
    trace: boolean;
    constructor(payloadManager?: PayloadManager);
    _transform(chunk: ISerializable | IMessage | Buffer, encoding: string, callback: TransformCallback): void;
    private _isChunkBuffer;
    private _isChunkSerializable;
    private _isChunckMessage;
}
