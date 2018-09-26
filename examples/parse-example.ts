import { StreamParser } from "../src";
import { DataTest } from "../examples/data-test";

import { createReadStream } from "fs";
import { CRC } from 'crc-full';

let parser = new StreamParser();
parser.crcFunction = (d: Buffer) => CRC.default("CRC16_CCIT_ZERO").computeBuffer(d);
let readTest = createReadStream("test-out.txt");
let data = new DataTest();
readTest.pipe(parser);

setInterval(() => {
    let p = parser.read(1);
    if (p !== null) {
        data.deserialize(p);
        console.log(data);
    }

}, 1000);

