import { TransformCallback, Writable } from "stream";
const startChar = 0x3b;


export class StreamParser extends Writable {

    constructor() {
        super();
    }

    private _len: number | null = null;
    private _pos: number = 0;
    private buf: Buffer = Buffer.alloc(0);
    private _timeout: NodeJS.Timer | null = null;

    public _write(chunk: Buffer, encoding: string, callback: (error?: Error | null) => void): void {
        if (chunk instanceof Buffer) {
            if (this._timeout) clearTimeout(this._timeout);
            while (chunk.length > 0) {
                if (this._len === null) {
                    while (chunk.length > 0 && chunk[0] !== startChar)
                        chunk = chunk.slice(1);
                    chunk = chunk.slice(1);
                    if (chunk.length > 0 && this._len === null) {
                        this._len = chunk[0];
                        chunk = chunk.slice(1);
                    }
                }
                if (chunk.length > 0 && this._len !== null) {
                    while (chunk.length > 0 && this._pos !== this._len) {
                        this.buf = Buffer.concat([this.buf, Buffer.from([chunk[0]])]);
                        chunk = chunk.slice(1);
                        this._pos++;
                    }
                    if (this._pos === this._len) {
                        this.emit("data", this.buf);
                        this._len = null;
                        this._pos = 0;
                        this.buf = Buffer.alloc(0);
                    } else {
                        if (this._timeout) clearTimeout(this._timeout);
                        this._timeout = setTimeout(() => {
                            this._len = null;
                            this._pos = 0;
                            this.buf = Buffer.alloc(0);
                        }, 100);
                    }
                }
            }
        }
        callback();
    }
}
