/// <reference types="node" />
import { TransformCallback, Transform } from "stream";
import { PayloadManager } from "../payload/payload-manager";
import { ISerializable, CrcFunction, IMessage } from "../payload/serializable-interface";
export declare class StreamBuilder extends Transform {
    private _payloadManager;
    startByte: number;
    checksum: CrcFunction;
    constructor(payloadManager?: PayloadManager);
    private _isChunkBuffer;
    private _isChunkSerializable;
    private _isChunckMessage;
    _transform(chunk: ISerializable | IMessage | Buffer, encoding: string, callback: TransformCallback): void;
}
