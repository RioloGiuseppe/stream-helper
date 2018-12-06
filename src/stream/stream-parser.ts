import { TransformCallback, Transform } from "stream";
import { PayloadManager } from "../payload/payload-manager";
import { ISerializable, CrcFunction, IMessage, LogFunction } from "../payload/serializable-interface";

export class StreamParser extends Transform {
    public startByte: number = 0;
    public crcFunction: CrcFunction;
    public logFunction: LogFunction;
    public trace: boolean = false;

    constructor(payloadManager?: PayloadManager) {
        super({
            objectMode: true
        });
        this._payloadManager = payloadManager || null;
    }
    public permissive: boolean = false;
    private _payloadManager: PayloadManager = null;
    private _len: number | null = null;
    private _head: Buffer = Buffer.alloc(0);
    private _payload: Buffer = Buffer.alloc(0);
    private _timeout: NodeJS.Timer | null = null;
    private _started: boolean = false;
    private _crcRead: Buffer = Buffer.alloc(0);
    private _crc: Buffer;

    public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
        if (chunk instanceof Buffer) {
            // if no data is received for 100ms, reset the state machine
            //if (this._timeout) clearTimeout(this._timeout);
            //this._timeout = setTimeout(() => this._reset(), 100);

            while (chunk.length > 0) {
                // If message is not started, remove all bytes before message start
                while (!this._started && chunk.length > 0 && chunk[0] !== this.startByte)
                    chunk = chunk.slice(1);

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

                // If exists a payload manager get head
                if (this._started === true && chunk.length > 0 && this._payloadManager instanceof PayloadManager && this._len !== null && this._head.length !== this._payloadManager.headSize) {
                    while (chunk.length > 0 && this._head.length !== this._payloadManager.headSize) {
                        this._head = Buffer.concat([this._head, Buffer.from([chunk[0]])]);
                        chunk = chunk.slice(1);
                    }
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
                    this._crc = this.crcFunction(Buffer.concat([this._head, this._payload]));
                    while (chunk.length > 0 && this._crcRead.length !== this._crc.length) {
                        this._crcRead = Buffer.concat([this._crcRead, Buffer.from([chunk[0]])]);
                        chunk = chunk.slice(1);
                    }
                }

                // parse received payload
                if ((this._payload.length === this._len && typeof this.crcFunction !== "function") ||
                    (this._payload.length === this._len && typeof this.crcFunction === "function" && this._crcRead.length === this._crc.length)) {
                    if (typeof this.crcFunction === "function") {
                        if (Buffer.compare(this._crcRead, this._crc) === 0)
                            this._parse();
                        else
                            this.emit("warn", new Error("CRC Error"));
                    }
                    else
                        this._parse();
                    this._reset();
                }
            }
        }
        callback();
    }

    private _parse() {
        if (this.trace === true && typeof this.logFunction === "function")
            this.logFunction("read", [this.startByte], [this._len], this._head, this._payload, this._crc);
        if (this._head !== null && "getObject" in this._payloadManager) {
            let deserializer = this._payloadManager.getObject(this._head);
            if (deserializer === null && !this.permissive) {
                this.emit("warn", new Error("Message non registered"));
            } else if (deserializer !== null) {
                let deserializerInstance: ISerializable;
                if (typeof (<Function>deserializer).prototype !== "undefined" && typeof (<Function>deserializer).prototype.constructor !== "undefined") {
                    deserializerInstance = new (<any>deserializer)();
                    if (typeof deserializerInstance.deserialize === "function") {
                        deserializerInstance.deserialize(this._payload);
                        this.push({ data: deserializerInstance, head: this._head } as IMessage);
                    }
                } else if (typeof (<ISerializable>deserializer).deserialize === "function") {
                    (<ISerializable>deserializer).deserialize(this._payload);
                    this.push({ data: deserializer, head: this._head } as IMessage);
                } else {
                    console.error("error deserialize payload");
                }
            } else {
                this.push({ head: this._head, data: this._payload } as IMessage);
            }
        } else {
            this.push({ head: this._head, data: this._payload } as IMessage);
        }
    }
    private _reset() {
        this._started = false;
        this._payload = Buffer.alloc(0);
        this._len = null;
        this._head = Buffer.alloc(0);
    }

    public _flush(cb: () => void) {
        cb()
    }
}
