import { TransformCallback, Writable, Transform } from "stream";
import { Serializable } from "byte-serializer";
import { PayloadManager } from "../payload/payload-manager";
import { ISerializable } from "../payload/serializable-interface";

export class StreamBuilder extends Transform {
    private _payloadManager: PayloadManager = null;
    public startByte: number = 0;
    public checksum: (data: Buffer) => Buffer;

    // TODO::STUFFING Function

    constructor(payloadManager: PayloadManager) {
        super({ objectMode: true });
        this._payloadManager = payloadManager || null;
    }

    public _transform(chunk: ISerializable, encoding: string, callback: TransformCallback): void {
        if (chunk instanceof Buffer) {
            let ch = typeof this.checksum !== 'function' ? [] : this.checksum(chunk);
            let b = Buffer.from([this.startByte, chunk.length, ...chunk, ...ch]);
            this.push(b);
        }
        if (typeof chunk.serialize === 'function') {
            let p = chunk.serialize();
            let action = this._payloadManager instanceof PayloadManager ? [this._payloadManager.getId(chunk)] : [];
            if (action[0] === null) {
                this.emit("error", new Error(`Message ${chunk.constructor.name} not registered`));
            } else {
                let ch = typeof this.checksum !== 'function' ? [] : this.checksum(p);
                let b = Buffer.from([this.startByte, p.length, ...action, ...p, ...ch]);
                this.push(b);
            }
        }
        callback();
    }
}