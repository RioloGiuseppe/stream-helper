import { ISerializable } from "./serializable-interface";

export class PayloadManager {
    private _idMessage: { [id: number]: ISerializable }

    constructor() {
        this._idMessage = {};
    }

    public registerMessage(id: number, message: ISerializable) {
        if (typeof this._idMessage[id] === 'undefined')
            this._idMessage[id] = message;
        else
            throw new Error(`Message ${id.toString(16)} already defined!`)
    }

    public unregisterMessage(id: number, message: ISerializable) {
        if (typeof this._idMessage[id] !== 'undefined')
            delete this._idMessage[id];
    }

    getObject(id: number): ISerializable {
        return (this._idMessage[id] || null);
    }

    getId(value: ISerializable): number {
        let k = Object.keys(this._idMessage).find(key => this._idMessage[key].cons === value.constructor);
        if (k !== undefined) return parseInt(k);
        else return null;
    }
}