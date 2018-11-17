import { ISerializable } from "./serializable-interface";

export class PayloadManager {
    private _idMessage: { [id: string]: ISerializable }
    public headSize: number;

    constructor() {
        this._idMessage = {};
    }

    public registerMessage(id: Buffer | number[], message: ISerializable) {
        if (!(id instanceof Buffer))
            id = Buffer.from(id)
        if (typeof this._idMessage[id.toString('base64')] === 'undefined')
            this._idMessage[id.toString('base64')] = message;
        else
            throw new Error(`Message ${id.toString('base64')} already defined!`)
    }

    public unregisterMessage(id: Buffer, message: ISerializable) {
        if (typeof this._idMessage[id.toString('base64')] !== 'undefined')
            delete this._idMessage[id.toString('base64')];
    }

    getObject(id: Buffer): ISerializable {
        return (this._idMessage[id.toString('base64')] || null);
    }

    getId(value: ISerializable): Buffer {
        let k = Object.keys(this._idMessage).find(key => this._idMessage[key].constructor === value.constructor);
        if (k !== undefined) return Buffer.from(k, 'base64');
        else return null;
    }
}