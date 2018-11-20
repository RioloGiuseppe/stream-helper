import { PayloadManager, StreamBuilder } from "../src";
import { DataTest } from "./data-test";
import { CRC } from 'crc-full';

import { createWriteStream } from "fs";

let writerTest = createWriteStream("test-out.txt");

var plManager = new PayloadManager(1);
plManager.registerMessage([2], new DataTest());

let builder = new StreamBuilder(plManager);
builder.startByte = 0x7E;
builder.checksum = (d: Buffer) => CRC.default("CRC16_CCITT_FALSE").computeBuffer(d);

builder.pipe(writerTest);

let data = new DataTest();
data.number = 55;
data.text = "Hello!"
builder.write(data);
