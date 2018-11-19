"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const payload_manager_1 = require("../payload/payload-manager");
class StreamParser extends stream_1.Transform {
    constructor(payloadManager) {
        super({
            objectMode: true
        });
        this.startByte = 0;
        this.permissive = false;
        this._payloadManager = null;
        this._len = null;
        this._head = Buffer.alloc(0);
        this._payload = Buffer.alloc(0);
        this._timeout = null;
        this._started = false;
        this._crcRead = Buffer.alloc(0);
        this._payloadManager = payloadManager || null;
    }
    _transform(chunk, encoding, callback) {
        if (chunk instanceof Buffer) {
            // if no data is received for 100ms, reset the state machine
            if (this._timeout)
                clearTimeout(this._timeout);
            this._timeout = setTimeout(() => this._reset(), 100);
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
                if (this._started === true && chunk.length > 0 && this._payloadManager instanceof payload_manager_1.PayloadManager && this._len !== null && this._head.length !== this._payloadManager.headSize) {
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
    _parse(data) {
        if (this._head !== null) {
            let o = this._payloadManager.getObject(this._head);
            if (o === null && !this.permissive) {
                this.emit("warn", new Error("Message non registered"));
            }
            else if (o !== null) {
                let d = new o.constructor();
                d.deserialize(this._payload);
                this.push({ data: d, head: this._head });
            }
            else {
                this.push(data);
            }
        }
        else {
            this.push(data);
        }
    }
    _reset() {
        this._started = false;
        this._payload = Buffer.alloc(0);
        this._len = null;
        this._head = null;
    }
    _flush(cb) {
        cb();
    }
}
exports.StreamParser = StreamParser;
//# sourceMappingURL=stream-parser.js.map