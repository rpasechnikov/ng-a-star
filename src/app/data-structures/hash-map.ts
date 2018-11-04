import { IHashable } from '../interfaces/ihashable';

/**Basic HashMap/Dictionary implementation */
export class HashMap<TKey extends IHashable, TValue> {
    elements: { [id: string]: TValue } = {};

    add(key: TKey, value: TValue): void {
        this.elements[key.getHash()] = value;
    }

    get(key: TKey): TValue {
        return this.elements[key.getHash()];
    }

    clear(): void {
        this.elements = {};
    }
}
