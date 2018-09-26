import { TransformCallback, Writable, Transform } from "stream";

export class StreamParser extends Transform {
    public startByte: number = 0;
    public crcFunction: (data: Buffer) => Buffer;

    constructor() {
        super({
            readableObjectMode: true
        });
    }

    private _len: number | null = null;
    private _pos: number = 0;
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
                            this.push(this._payload);
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
                                this.push(this._payload);
                            } else {
                                console.warn("CRC ERR");
                            }
                        }
                    } else {
                        if (this._timeout) clearTimeout(this._timeout);
                        this._timeout = setTimeout(() => {
                            this._len = null;
                            this._payload = Buffer.alloc(0);
                        }, 100);
                    }
                }
            }
        }
        callback();
    }
}
