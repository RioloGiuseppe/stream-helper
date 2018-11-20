"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PayloadManager {
    constructor() {
        this._idMessage = {};
    }
    registerMessage(id, message) {
        if (!(id instanceof Buffer))
            id = Buffer.from(id);
        if (typeof this._idMessage[id.toString('base64')] === 'undefined')
            this._idMessage[id.toString('base64')] = message;
        else
            throw new Error(`Message ${id.toString('base64')} already defined!`);
    }
    unregisterMessage(id, message) {
        if (typeof this._idMessage[id.toString('base64')] !== 'undefined')
            delete this._idMessage[id.toString('base64')];
    }
    getObject(id) {
        return (this._idMessage[id.toString('base64')] || null);
    }
    getId(value) {
        let k = Object.keys(this._idMessage).find(key => (this._idMessage[key] === value && value.constructor.name.toLowerCase() === "function") ||
            (this._idMessage[key].constructor === value.constructor && value.constructor.name.toLowerCase() !== "function") ||
            (typeof this._idMessage[key] === "function" && this._idMessage[key].name === value.constructor.name && value.constructor.name !== "Function"));
        if (k !== undefined)
            return Buffer.from(k, 'base64');
        else
            return null;
    }
}
exports.PayloadManager = PayloadManager;
//# sourceMappingURL=payload-manager.js.map