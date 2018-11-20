/// <reference types="node" />
import { ISerializable } from "./serializable-interface";
export declare class PayloadManager {
    private _idMessage;
    private _headSize;
    constructor(headSize: number);
    readonly headSize: number;
    registerMessage(id: Buffer | number[], message: (new () => ISerializable) | ISerializable): void;
    unregisterMessage(id: Buffer, message: (new () => ISerializable) | ISerializable): void;
    getObject(id: Buffer): (new () => ISerializable) | ISerializable;
    getId(value: (new () => ISerializable) | ISerializable): Buffer;
}
