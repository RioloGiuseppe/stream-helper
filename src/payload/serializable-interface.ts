export interface ISerializable {
    serialize: () => Buffer;
    deserialize: (data: Buffer) => void;
}

export type CrcFunction = (data: Buffer) => Buffer;
export type LogFunction = (direction: "read" | "write",
    start: Buffer | number[],
    len: Buffer | number[],
    head: Buffer | number[],
    payload: Buffer | number[],
    checksum: Buffer | number[]) => void;

export interface IMessage {
    head?: Buffer | number[];
    data: ISerializable | Buffer;
}