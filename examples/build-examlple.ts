import { StreamBuilder } from "../src/stream/stream-builder";
import { DataTest } from "../examples/data-test";

import { createWriteStream } from "fs";
import { CRC } from 'crc-full';
import { PayloadManager } from "../src";

var plManager = new PayloadManager();
plManager.registerMessage(2, new DataTest());
let builder = new StreamBuilder(plManager);
builder.startByte = 0x01;
builder.checksum = (d:Buffer) => CRC.default("CRC16_CCIT_ZERO").computeBuffer(d);
let writerTest = createWriteStream("test-out.txt");
let data = new DataTest();
data.number = 55;
data.text = "Hello!"
builder.pipe(writerTest);
builder.write(data);
