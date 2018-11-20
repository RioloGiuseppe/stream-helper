/// <reference types="node" />
export interface ISerializable {
    serialize: () => Buffer;
    deserialize: (data: Buffer) => void;
}
export declare type CrcFunction = (data: Buffer) => Buffer;
export interface IMessage {
    head?: Buffer | number[];
    data: ISerializable | Buffer;
}
