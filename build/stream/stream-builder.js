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
        this._payloadManager = payloadManager || null;
    }
    _isChunkBuffer(chunk) {
        return chunk instanceof Buffer;
    }
    _isChunkSerializable(chunk) {
        return "serialize" in chunk;
    }
    _isChunckMessage(chunk) {
        return "data" in chunk && "serialize" in chunk.data;
    }
    _transform(chunk, encoding, callback) {
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
            let action = this._payloadManager instanceof payload_manager_1.PayloadManager ? [this._payloadManager.getId(chunk)] : [];
            if (action[0] === null) {
                this.emit("error", new Error(`Message ${chunk.constructor.name} not registered`));
            }
            else {
                let ch = typeof this.checksum !== 'function' ? [] : this.checksum(p);
                let b = Buffer.from([this.startByte, p.length, ...action, ...p, ...ch]);
                this.push(b);
            }
        }
        callback();
    }
}
exports.StreamBuilder = StreamBuilder;
//# sourceMappingURL=stream-builder.js.map