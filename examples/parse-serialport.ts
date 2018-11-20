import { StreamParser, PayloadManager } from "../src";
import { DataTest } from "./data-test";
import { CRC } from 'crc-full';

import * as SerialPort from 'serialport'

var serialport = new SerialPort('COM5', {
    baudRate: 9600
}, (e) => {
    console.error(e);
});

var plManager = new PayloadManager(1);
plManager.registerMessage([2], new DataTest());

let parser = new StreamParser(plManager);
parser.startByte = 0x7E;
parser.crcFunction = (d: Buffer) => CRC.default("CRC16_CCITT_FALSE").computeBuffer(d);

serialport.pipe(parser);

parser.on("warn", (e) => console.warn(e));
parser.on("data", (c) => console.info(c));


