"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_builder_1 = require("./stream-builder");
const stream_parser_1 = require("./stream-parser");
class StreamDuplex extends stream_parser_1.StreamParser {
    constructor(payloadManager) {
        super(payloadManager);
        this._builder = new stream_builder_1.StreamBuilder(payloadManager || null);
    }
    get startByte() {
        return super.startByte;
    }
    set startByte(value) {
        super.startByte = value;
        if (this._builder)
            this._builder.startByte = value;
    }
    get crcFunction() {
        return super.crcFunction;
    }
    set crcFunction(value) {
        super.crcFunction = value;
        if (this._builder)
            this._builder.checksum = value;
    }
    get trace() {
        return super.trace;
    }
    set trace(value) {
        super.trace = value;
        if (this._builder)
            this._builder.trace = value;
    }
    get logFunction() {
        return super.logFunction;
    }
    set logFunction(value) {
        super.logFunction = value;
        if (this._builder)
            this._builder.logFunction = value;
    }
    get builder() {
        return this._builder;
    }
    send(data) {
        this._builder.write(data);
    }
}
exports.StreamDuplex = StreamDuplex;
//# sourceMappingURL=stream-duplex.js.map