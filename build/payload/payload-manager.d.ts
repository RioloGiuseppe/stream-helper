/// <reference types="node" />
import { ISerializable } from "./serializable-interface";
export declare class PayloadManager {
    private _idMessage;
    headSize: number;
    constructor();
    registerMessage(id: Buffer | number[], message: (new () => ISerializable) | ISerializable): void;
    unregisterMessage(id: Buffer, message: (new () => ISerializable) | ISerializable): void;
    getObject(id: Buffer): (new () => ISerializable) | ISerializable;
    getId(value: (new () => ISerializable) | ISerializable): Buffer;
}
