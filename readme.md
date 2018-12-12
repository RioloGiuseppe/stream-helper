# stream-helper

![Support Node of LTS](https://img.shields.io/badge/node-LTS-brightgreen.svg?style=plastic) ![npm version](https://img.shields.io/badge/npm-3.5.0-brightgreen.svg?style=plastic) 
![Build passing](https://img.shields.io/badge/build-passing%20Typescript-brightgreen.svg?style=plastic) 
![Support](https://img.shields.io/badge/support-JavaScript%20|%20TypeScript-brightgreen.svg?style=plastic) 
![dependencies none](https://img.shields.io/badge/dependencies-None-blue.svg?style=plastic) ![License mit](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)

---

# Description


# Install
```sh
$ npm install stream-helper
```

# Usage

## Define payload


```typescript
export class DataTest extends Serializable {

    @SerializableInfo.position(0)
    @SerializableInfo.numberType(NumberType.UInt32)
    public number: number;

    @SerializableInfo.position(4)
    @SerializableInfo.textEncoding(TextEncoding.ASCII)
    @SerializableInfo.length(10)
    public text: string;
}
```

## Create streams

Builder, write-only stream:   

```typescript
let builder = new StreamBuilder();
builder.startByte = 0x7E;

// Optional
builder.checksum = (d: Buffer) => CRC.default("CRC16_CCITT_FALSE").computeBuffer(d);
```
Parser, read-only stream:   

```typescript
let parser = new StreamParser(plManager);
parser.startByte = 0x7E;

// Optional
parser.crcFunction = (d: Buffer) => CRC.default("CRC16_CCITT_FALSE").computeBuffer(d);
```

Duplex, read-write stream:   

```typescript
var duplex = new StreamDuplex(plManager);
duplex.startByte = 0x7E;

// Optional
duplex.checksum = (d: Buffer) => CRC.default('CRC16_CCITT_FALSE').computeBuffer(d);
```
## Configure I/O


```typescript
builder.pipe(serialport);

serialport.pipe(parser);

serialport.pipe(duplex);
duplex.builder.pipe(serialport);
```

## Send payload


```typescript
let data = new DataTest();
data.number = 55;
data.text = "Hello!"
builder.write(data);
```

## Configure payload manager using head


```typescript
var plManager = new PayloadManager(1);
plManager.registerMessage([2], new DataTest());
```

## Send payload with head


```typescript
let data = new DataTest();
data.number = 55;
data.text = "Hello!"
builder.write(data);
// Or
duplex.send(data);
```

## Receive and parse data


```typescript
parser.on("data", (c) => console.info(c));
```

## Log data

```typescript
parser.trace = true;
parser.logFunction = (direction, start, len, head, payload, checksum) => 
    console.log(`${Buffer.from(direction).toString('hex')} 
                 ${Buffer.from(start).toString('hex')} 
                 ${Buffer.from(len).toString('hex')} 
                 ${Buffer.from(head).toString('hex').replace(/(\S{2})/g,"$1 ")} 
                 ${Buffer.from(payload).toString('hex').replace(/(\S{2})/g,"$1 ")} 
                 ${Buffer.from(checksum).toString('hex').replace(/(\S{2})/g,"$1 ")}`);
```
# Samples

To build and run samples:
```sh
git clone https://github.com/RioloGiuseppe/stream-helper.git
cd stream-helper

npm run create-samples
# npm run build-samples

node build/demo/examples/duplex-serialport.js
```


# License 

stream-helper packages are all [MIT licensed](https://github.com/riologiuseppe/stream-helper/blob/master/LICENSE) and all it's dependencies are MIT licensed.

# Related

- [`serial-port`](https://github.com/node-serialport/node-serialport) - Serial port library
- [`crc-full`](https://github.com/riologiuseppe/crc-full) - Crc library
- [`byte-serializer`](https://github.com/riologiuseppe/byte-serializer) - Crc library