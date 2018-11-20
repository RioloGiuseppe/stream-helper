import { ISerializable } from "./serializable-interface";

export class PayloadManager {
    private _idMessage: { [id: string]: (new () => ISerializable) | ISerializable }
    private _headSize: number;

    constructor(headSize: number) {
        this._idMessage = {};
        this._headSize = headSize;
    }

    public get headSize() {
        return this._headSize;
    }

    public registerMessage(id: Buffer | number[], message: (new () => ISerializable) | ISerializable) {
        if (id.length !== this._headSize)
            throw new Error("Invalid head size");
        if (!(id instanceof Buffer))
            id = Buffer.from(id)
        if (typeof this._idMessage[id.toString('base64')] === 'undefined')
            this._idMessage[id.toString('base64')] = message;
        else
            throw new Error(`Message ${id.toString('base64')} already defined!`)
    }

    public unregisterMessage(id: Buffer, message: (new () => ISerializable) | ISerializable) {
        if (typeof this._idMessage[id.toString('base64')] !== 'undefined')
            delete this._idMessage[id.toString('base64')];
    }

    getObject(id: Buffer): (new () => ISerializable) | ISerializable {
        return (this._idMessage[id.toString('base64')] || null);
    }

    getId(value: (new () => ISerializable) | ISerializable): Buffer {
        let k = Object.keys(this._idMessage).find(key =>
            (this._idMessage[key] === value && value.constructor.name.toLowerCase() === "function") ||
            (this._idMessage[key].constructor === value.constructor && value.constructor.name.toLowerCase() !== "function") ||
            (typeof this._idMessage[key] === "function" && (<Function>this._idMessage[key]).name === value.constructor.name && value.constructor.name !== "Function"));
        if (k !== undefined) return Buffer.from(k, 'base64');
        else return null;
    }
}