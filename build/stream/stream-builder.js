"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const payload_manager_1 = require("../payload/payload-manager");
class StreamBuilder extends stream_1.Transform {
    // TODO::STUFFING Function
    constructor(payloadManager) {
        super({ objectMode: true });
        this._payloadManager = null;
        this.startByte = 0;
        this.trace = false;
        this._payloadManager = payloadManager || null;
    }
    _transform(chunk, encoding, callback) {
        if (this._isChunkBuffer(chunk)) {
            let ch = typeof this.checksum !== 'function' ? [] : this.checksum(chunk);
            let b = Buffer.from([this.startByte, chunk.length, ...chunk, ...ch]);
            if (this.trace === true && typeof this.logFunction === "function")
                this.logFunction("write", [this.startByte], [chunk.length], [], chunk || [], ch || []);
            this.push(b);
        }
        if (this._isChunckMessage(chunk)) {
            if ((chunk.data === null || chunk.data === undefined) && (chunk.head === null || chunk.head === undefined))
                console.error("Invalid data");
            else {
                let p = chunk.data ? chunk.data.serialize() : Buffer.alloc(0);
                let h = chunk.head ? chunk.head : Buffer.alloc(0);
                if (!(h instanceof Buffer))
                    h = Buffer.from(h);
                let ch = typeof this.checksum !== 'function' ? [] : this.checksum(Buffer.concat([h, p]));
                let b = Buffer.from([this.startByte, p.length, ...h, ...p, ...ch]);
                if (this.trace === true && typeof this.logFunction === "function")
                    this.logFunction("write", [this.startByte], [p.length], h || [], p || [], ch || []);
                this.push(b);
            }
        }
        if (this._isChunkSerializable(chunk)) {
            let p = chunk.serialize();
            let h = this._payloadManager instanceof payload_manager_1.PayloadManager ? this._payloadManager.getId(chunk) : Buffer.alloc(0);
            if (h[0] === null) {
                this.emit("error", new Error(`Message ${chunk.constructor.name} not registered`));
            }
            else {
                let ch = typeof this.checksum !== 'function' ? Buffer.alloc(0) : this.checksum(Buffer.concat([h, p]));
                let b = Buffer.from([this.startByte, p.length, ...h, ...p, ...ch]);
                if (this.trace === true && typeof this.logFunction === "function")
                    this.logFunction("write", [this.startByte], [p.length], h || [], p || [], ch || []);
                this.push(b);
            }
        }
        callback();
    }
    _isChunkBuffer(chunk) {
        return chunk instanceof Buffer;
    }
    _isChunkSerializable(chunk) {
        return "serialize" in chunk;
    }
    _isChunckMessage(chunk) {
        return "head" in chunk || ("data" in chunk && "serialize" in chunk.data);
    }
}
exports.StreamBuilder = StreamBuilder;
//# sourceMappingURL=stream-builder.js.map