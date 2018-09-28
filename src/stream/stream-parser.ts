import { TransformCallback, Writable, Transform } from "stream";
import { PayloadManager } from "../payload/payload-manager";
import { ISerializable } from "../payload/serializable-interface";

export class StreamParser extends Transform {
    public startByte: number = 0;
    public crcFunction: (data: Buffer) => Buffer;

    constructor(payloadManager?: PayloadManager) {
        super({
            objectMode: true
        });
        this._payloadManager = payloadManager || null;
    }
    public permissive: boolean = false;
    private _payloadManager: PayloadManager = null;
    private _len: number | null = null;
    private _action: number | null = null;
    private _payload: Buffer = Buffer.alloc(0);
    private _timeout: NodeJS.Timer | null = null;
    private _started: boolean = false;
    private _crcRead: Buffer = Buffer.alloc(0);
    private _crc: Buffer;

    public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
        if (chunk instanceof Buffer) {
            // if no data is received for 100ms, reset the state machine
            if (this._timeout) clearTimeout(this._timeout);
            this._timeout = setTimeout(() => this._reset(), 100);

            while (chunk.length > 0) {
                // If message is not started, remove all bytes before message start
                while (!this._started && chunk.length > 0 && chunk[0] !== this.startByte) chunk = chunk.slice(1);
                
                // Start message reading
                if (chunk.length > 0 && chunk[0] === this.startByte) {
                    chunk = chunk.slice(1);
                    this._started = true;
                }

                // Read payload length
                if (this._started === true && chunk.length > 0 && this._len === null) {
                    this._len = chunk[0];
                    chunk = chunk.slice(1);
                }

                // If exists a payload manager get action
                if (this._started === true && chunk.length > 0 && this._payloadManager instanceof PayloadManager && this._action === null) {
                    this._action = chunk[0];
                    chunk = chunk.slice(1);
                }

                // read payload
                if (this._started === true && chunk.length > 0 && this._len !== null) {
                    while (chunk.length > 0 && this._payload.length !== this._len) {
                        this._payload = Buffer.concat([this._payload, Buffer.from([chunk[0]])]);
                        chunk = chunk.slice(1);
                    }
                }

                // read checksum if checksum function is defined
                if (this._started === true && typeof this.crcFunction === "function" && this._payload.length === this._len) {
                    this._crc = this.crcFunction(this._payload);
                    while (chunk.length > 0 && this._crcRead.length !== this._crc.length) {
                        this._crcRead = Buffer.concat([this._crcRead, Buffer.from([chunk[0]])]);
                        chunk = chunk.slice(1);
                    }
                }

                // parse received payload
                if (this._payload.length === this._len) {
                    if (typeof this.crcFunction === "function") {
                        if (Buffer.compare(this._crcRead, this._crc) === 0)
                            this._parse(this._payload);
                        else
                            this.emit("warn", new Error("CRC Error"));
                    }
                    else
                        this._parse(this._payload);
                    this._reset();
                }
            }
        }
        callback();
    }

    private _parse(data: Buffer) {
        if (this._action !== null) {
            let o = this._payloadManager.getObject(this._action);
            if (o === null && !this.permissive) {
                this.emit("warn", new Error("Message non registered"));
            } else if (o !== null) {
                let d: ISerializable = new (<any>o.constructor)();
                d.deserialize(this._payload);
                this.push(d);
            } else {
                this.push(data);
            }

        } else {
            this.push(data);
        }
    }
    private _reset() {
        this._started = false;
        this._payload = Buffer.alloc(0);
        this._len = null;
        this._action = null;
    }

    public _flush(cb: () => void) {
        cb()
    }
}
