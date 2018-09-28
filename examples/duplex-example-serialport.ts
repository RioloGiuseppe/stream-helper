import { PayloadManager, StreamDuplex } from "../src";
import { DataTest } from "./data-test";
import { CRC } from 'crc-full';


var plManager = new PayloadManager();
plManager.registerMessage(2, new DataTest());

var duplex = new StreamDuplex(plManager);
duplex.startByte = 0x01;
duplex.checksum = (d: Buffer) => CRC.default('CRC16_CCIT_ZERO').computeBuffer(d);


