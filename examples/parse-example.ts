import { StreamParser, PayloadManager } from "../src";
import { DataTest } from "./data-test";
import { CRC } from 'crc-full';

import { createReadStream } from "fs";

let readTest = createReadStream("test-out.txt");

let plManager = new PayloadManager();
plManager.registerMessage([2], new DataTest());

let parser = new StreamParser(plManager);
parser.startByte = 0x01;
parser.crcFunction = (d: Buffer) => CRC.default("CRC16_CCITT_FALSE").computeBuffer(d);

readTest.pipe(parser);

parser.on("warn", (e) => console.warn(e));
parser.on("data", (c) => console.info(c));