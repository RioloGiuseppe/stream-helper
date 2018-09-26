import { TransformCallback, Writable, Transform } from "stream";
import { PayloadManager } from "../payload/payload-manager";
import { ISerializable } from "../payload/serializable-interface";

export class StreamParser extends Transform {
    public startByte: number = 0;
    public crcFunction: (data: Buffer) => Buffer;

    constructor(payloadManager?: PayloadManager) {
        super({
            readableObjectMode: true
        });
        this._payloadManager = payloadManager || null;
    }

    private _payloadManager: PayloadManager = null;
    private _len: number | null = null;
    private _action: number | null = null;
    private _payload: Buffer = Buffer.alloc(0);
    private _timeout: NodeJS.Timer | null = null;
    private _crc: Buffer = null;

    private _crcRead: Buffer = Buffer.alloc(0);

    public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
        if (chunk instanceof Buffer) {
            if (this._timeout) clearTimeout(this._timeout);
            while (chunk.length > 0) {
                if (this._len === null) {
                    while (chunk.length > 0 && chunk[0] !== this.startByte)
                        chunk = chunk.slice(1);
                    chunk = chunk.slice(1);
                    if (chunk.length > 0 && this._len === null) {
                        this._len = chunk[0];
                        chunk = chunk.slice(1);
                    }
                    if (chunk.length > 0 && this._payloadManager instanceof PayloadManager && this._action === null) {
                        this._action = chunk[0];
                        chunk = chunk.slice(1);
                    }
                }
                if (chunk.length > 0 && this._len !== null) {
                    while (chunk.length > 0 && this._payload.length !== this._len) {
                        this._payload = Buffer.concat([this._payload, Buffer.from([chunk[0]])]);
                        chunk = chunk.slice(1);
                    }
                    if (this._payload.length === this._len && !(this._crc instanceof Buffer)) {
                        if (typeof this.crcFunction === "function") {
                            this._crc = this.crcFunction(this._payload);
                        } else {
                            if (this._action !== null) {
                                let s = this._payloadManager.getObject(this._action);
                                if (s === null) {
                                    this.emit("error", new Error());
                                    this._len = null;
                                    this._action = null;
                                    this._payload = Buffer.alloc(0);
                                    callback();
                                    return;
                                } else {
                                    let d: ISerializable = new (<any>s.constructor)();
                                    d.deserialize(this._payload);
                                    this.push(d);
                                }
                            } else {
                                this.push(this._payload);
                            }
                            this._action = null;
                            this._len = null;
                            this._payload = Buffer.alloc(0);
                        }
                    } else if (this._crc instanceof Buffer) {
                        while (chunk.length > 0 && this._crcRead.length !== this._crc.length) {
                            this._crcRead = Buffer.concat([this._crcRead, Buffer.from([chunk[0]])]);
                            chunk = chunk.slice(1);
                        }
                        if (this._crcRead.length === this._crc.length) {
                            if (Buffer.compare(this._crcRead, this._crc) === 0) {
                                if (this._action !== null) {
                                    let s = this._payloadManager.getObject(this._action);
                                    if (s === null) {
                                        this.emit("error", new Error());
                                        this._len = null;
                                        this._action = null;
                                        this._payload = Buffer.alloc(0);
                                        callback();
                                        return;
                                    } else {
                                        let d: ISerializable = new (<any>s.constructor)();
                                        d.deserialize(this._payload);
                                        this.push(d);
                                    }
                                } else {
                                    this.push(this._payload);
                                }
                                this._action = null;
                                this._len = null;
                                this._payload = Buffer.alloc(0);
                            } else {
                                this.emit("error", new Error("CRC ERR"));
                            }
                        }
                    } else {
                        if (this._timeout) clearTimeout(this._timeout);
                        this._timeout = setTimeout(() => {
                            this._len = null;
                            this._action = null;
                            this._payload = Buffer.alloc(0);
                        }, 100);
                    }
                }
            }
        }
        callback();
    }
}
