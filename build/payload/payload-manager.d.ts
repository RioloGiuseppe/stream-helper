/// <reference types="node" />
import { ISerializable } from "./serializable-interface";
export declare class PayloadManager {
    private _idMessage;
    headSize: number;
    constructor();
    registerMessage(id: Buffer | number[], message: ISerializable): void;
    unregisterMessage(id: Buffer, message: ISerializable): void;
    getObject(id: Buffer): ISerializable;
    getId(value: ISerializable): Buffer;
}
