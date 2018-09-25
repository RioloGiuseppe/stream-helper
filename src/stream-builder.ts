import { TransformCallback, Writable } from "stream";

export class StreamBuilder extends Writable {

    constructor() {
        super({
            objectMode: true
        });
    }

    public _transform(chunk: any, encoding: string, callback: TransformCallback): void {
        console.log(chunk)
        callback();
    }

}