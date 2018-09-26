export interface ISerializable {
    serialize: () => Buffer;
    deserialize: (data: Buffer) => void;
}