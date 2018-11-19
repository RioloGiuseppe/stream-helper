export interface ISerializable {
    serialize: () => Buffer;
    deserialize: (data: Buffer) => void;
}

export type CrcFunction = (data: Buffer) => Buffer;

export interface IMessage {
    head?: Buffer;
    data: ISerializable;
}