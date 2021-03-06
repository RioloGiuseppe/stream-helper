import { PayloadManager, StreamDuplex } from "../src";
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

var duplex = new StreamDuplex(plManager);
duplex.startByte = 0x7E;
duplex.crcFunction = (d: Buffer) => CRC.default('CRC16_CCITT_FALSE').computeBuffer(d);

serialport.pipe(duplex);
duplex.builder.pipe(serialport);

duplex.on("warn", (e) => console.warn(e));
duplex.on("data", (c) => console.info(c));

let data = new DataTest();
data.number = 85;
data.text = "hello!";

setInterval(() => duplex.send(data), 1000);