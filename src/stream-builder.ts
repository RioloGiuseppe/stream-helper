import { TransformCallback, Writable, Transform } from "stream";
import { Serializable } from "byte-serializer";

export class StreamBuilder extends Transform {

    public startByte: number = 0;
    public crcFunction: (data: Buffer) => Buffer;

    constructor() {
        super({ objectMode: true });
    }

    public _transform(chunk: Serializable, encoding: string, callback: TransformCallback): void {
        if (chunk instanceof Serializable) {
            let p = chunk.serialize();
            let ch = typeof this.crcFunction !== 'function' ? [] : this.crcFunction(p)
            let b = Buffer.from([this.startByte, chunk.bufferLength, ...p, ...ch]);
            this.push(b);
        }

        callback();
    }

}