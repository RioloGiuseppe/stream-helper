"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_builder_1 = require("./stream-builder");
const stream_parser_1 = require("./stream-parser");
class StreamDuplex extends stream_parser_1.StreamParser {
    get startByte() { return this._startByte; }
    set startByte(value) {
        this._startByte = value;
        if (this._builder)
            this._builder.startByte = value;
    }
    get checksum() { return this._checksum; }
    set checksum(value) {
        this._checksum = value;
        if (this._builder)
            this._builder.checksum = value;
    }
    get trace() { return super.trace; }
    set trace(value) {
        super.trace = value;
        if (this._builder)
            this._builder.trace = value;
    }
    get logFunction() { return super.logFunction; }
    set logFunction(value) {
        super.logFunction = value;
        if (this._builder)
            this._builder.logFunction = value;
    }
    get builder() { return this._builder; }
    constructor(payloadManager) {
        super(payloadManager);
        this._builder = new stream_builder_1.StreamBuilder(payloadManager || null);
    }
    send(data) {
        this._builder.write(data);
    }
}
exports.StreamDuplex = StreamDuplex;
//# sourceMappingURL=stream-duplex.js.map