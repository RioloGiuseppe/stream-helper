import { PayloadManager, StreamBuilder } from "../src";
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

let builder = new StreamBuilder(plManager);
builder.startByte = 0x7E;
builder.crcFunction = (d: Buffer) => CRC.default("CRC16_CCITT_FALSE").computeBuffer(d);

builder.pipe(serialport);

let data = new DataTest();
data.number = 55;
data.text = "Hello!"
builder.write(data);
