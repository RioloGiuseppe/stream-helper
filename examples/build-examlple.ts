import { StreamBuilder } from "../src/stream-builder";
import { DataTest } from "../examples/data-test";

import { createWriteStream } from "fs";
import { CRC } from 'crc-full';

let buider = new StreamBuilder();
buider.crcFunction = (d:Buffer) => CRC.default("CRC16_CCIT_ZERO").computeBuffer(d);
let writerTest = createWriteStream("test-out.txt");
let data = new DataTest();
data.number = 55;
data.text = "Hello!"
buider.pipe(writerTest);
buider.write(data);
