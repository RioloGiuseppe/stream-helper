import { TransformCallback, Writable, Transform } from "stream";
import { PayloadManager } from "../payload/payload-manager";
import { ISerializable, CrcFunction, IMessage } from "../payload/serializable-interface";

export class StreamBuilder extends Transform {
    private _payloadManager: PayloadManager = null;
    public startByte: number = 0;
    public checksum: CrcFunction;

    // TODO::STUFFING Function

    constructor(payloadManager?: PayloadManager) {
        super({ objectMode: true });
        this._payloadManager = payloadManager || null;
    }

    private _isChunkBuffer(chunk: ISerializable | IMessage | Buffer): chunk is Buffer {
        return chunk instanceof Buffer
    }

    private _isChunkSerializable(chunk: ISerializable | IMessage | Buffer): chunk is ISerializable {
        return "serialize" in chunk;
    }

    private _isChunckMessage(chunk: ISerializable | IMessage | Buffer): chunk is IMessage {
        return "data" in chunk && "serialize" in chunk.data;
    }

    public _transform(chunk: ISerializable | IMessage | Buffer, encoding: string, callback: TransformCallback): void {
        if (this._isChunkBuffer(chunk)) {
            let ch = typeof this.checksum !== 'function' ? [] : this.checksum(chunk);
            let b = Buffer.from([this.startByte, chunk.length, ...chunk, ...ch]);
            this.push(b);
        }
        if (this._isChunckMessage(chunk)) {
            let p = chunk.data.serialize();
            let action = chunk.head ? chunk.head : [];
            let ch = typeof this.checksum !== 'function' ? [] : this.checksum(p);
            let b = Buffer.from([this.startByte, p.length, ...action, ...p, ...ch]);
            this.push(b);
        }
        if (this._isChunkSerializable(chunk)) {
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