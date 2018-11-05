import { IHashable } from '../interfaces/ihashable';

/**Represents a basic 2-d coordinate */
export class Vector2 implements IHashable {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getHash(): string {
        return this.x + ',' + this.y;
    }

    toString(): string {
        return this.getHash();
    }
}
